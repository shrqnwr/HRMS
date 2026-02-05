import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Mail, Phone, MapPin, MoreHorizontal, Download, UserPlus, X, Save, Edit2, Upload, FileSpreadsheet } from 'lucide-react';
import { Employee } from '../types';
import { Card, Button, Badge, SectionHeader, Modal } from '../components';
import * as XLSX from 'xlsx';

interface CoreHRProps {
  employees: Employee[];
}

export const CoreHR: React.FC<CoreHRProps> = ({ employees: initialEmployees }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [activeTab, setActiveTab] = useState(0);

  // Initial Empty Employee State
  const initialFormState: Partial<Employee> = {
    role: 'EMPLOYEE',
    status: 'Active',
    gender: 'Other',
    employmentType: 'Regular',
    salaryFrequency: 'Annual',
    contractType: 'Full-time',
    recordStatus: 'Active',
    highRiskRole: false
  };

  const [formData, setFormData] = useState<Partial<Employee>>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Auto-calculation & Logic ---
  useEffect(() => {
    // Calculate Age when DOB changes
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const diff_ms = Date.now() - dob.getTime();
      const age_dt = new Date(diff_ms);
      const calculatedAge = Math.abs(age_dt.getUTCFullYear() - 1970);
      
      if (formData.age !== calculatedAge) {
         setFormData(prev => ({ ...prev, age: calculatedAge }));
      }
    }
  }, [formData.dateOfBirth]);

  useEffect(() => {
    // Link Manager Name from ID if possible
    if (formData.managerId) {
      const manager = employees.find(e => e.id === formData.managerId);
      if (manager && manager.firstName !== formData.managerName) {
        setFormData(prev => ({ 
          ...prev, 
          managerName: `${manager.firstName} ${manager.lastName}`,
          managerEmail: manager.email
        }));
      }
    }
  }, [formData.managerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle Numeric Inputs
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
    } else if (type === 'checkbox') {
       const checked = (e.target as HTMLInputElement).checked;
       setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // 1. Required Fields
    if (!formData.id) newErrors.id = "Employee ID is required";
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.joiningDate) newErrors.joiningDate = "Joining Date is required";
    if (!formData.designation) newErrors.designation = "Designation is required";

    // 2. Unique Constraints
    const isDuplicateId = employees.some(e => e.id === formData.id && (modalMode === 'add' || e.id !== formData.id));
    if (modalMode === 'add' && employees.some(e => e.id === formData.id)) {
      newErrors.id = "Employee ID already exists";
    }

    const isDuplicateEmail = employees.some(e => e.email === formData.email && (modalMode === 'add' || e.id !== formData.id));
    if (isDuplicateEmail) {
      newErrors.email = "Email address already in use";
    }

    // 3. Logic Checks
    if (formData.salaryRangeMin && formData.salaryRangeMax && formData.salaryRangeMin > formData.salaryRangeMax) {
      newErrors.salaryRangeMin = "Min salary cannot be greater than Max salary";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    // Generate next ID suggestion
    const nextId = `EMP${(employees.length + 1).toString().padStart(3, '0')}`;
    setFormData({ ...initialFormState, id: nextId });
    setModalMode('add');
    setActiveTab(0);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setFormData({ ...employee });
    setModalMode('edit');
    setActiveTab(0);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Set Metadata
    const timestamp = new Date().toISOString().split('T')[0];
    const updatedData = {
      ...formData,
      lastModifiedDate: timestamp,
      // Ensure position fallback is set for UI compatibility
      position: formData.designation || formData.position
    } as Employee;

    if (modalMode === 'add') {
      const newEmployee = {
        ...updatedData,
        avatar: 'https://picsum.photos/200',
        recordStartDate: timestamp,
      };
      setEmployees([...employees, newEmployee]);
    } else {
      setEmployees(employees.map(emp => emp.id === updatedData.id ? updatedData : emp));
    }

    setIsModalOpen(false);
  };

  // --- Bulk Import/Export Logic ---

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(employees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "Nexus_Employee_Directory.xlsx");
  };

  const handleDownloadTemplate = () => {
    const templateHeaders = [
      {
        id: "EMP000",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        designation: "Developer",
        joiningDate: "2023-01-01",
        baseSalary: 50000,
        location: "Remote",
        status: "Active"
      }
    ];
    const ws = XLSX.utils.json_to_sheet(templateHeaders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Employee_Import_Template.xlsx");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws) as any[];

      const newEmployees: Employee[] = jsonData.map((row: any) => ({
        ...initialFormState,
        ...row,
        id: row.id || `EMP${Math.floor(Math.random() * 100000)}`,
        role: row.role || 'EMPLOYEE',
      }));

      setEmployees(prev => {
        // Filter out duplicates based on ID
        const existingIds = new Set(prev.map(e => e.id));
        const uniqueNew = newEmployees.filter(e => !existingIds.has(e.id));
        return [...prev, ...uniqueNew];
      });
      
      alert(`Successfully imported ${newEmployees.length} rows.`);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error("Import failed:", error);
      alert("Failed to import file.");
    }
  };

  const tabs = ['Basic Info', 'Employment', 'Job & Org', 'Compensation', 'Work Conditions', 'Tracking & Meta'];

  return (
    <div>
      <SectionHeader 
        title="Employee Directory" 
        description="Manage your workforce profiles and records."
        action={
          <div className="flex space-x-2">
             <Button variant="outline" onClick={handleDownloadTemplate} title="Download Import Template">
                <FileSpreadsheet size={16} className="mr-2"/> Template
             </Button>
             <Button variant="primary" onClick={openAddModal}>
                <UserPlus size={16} className="mr-2"/> Add Employee
             </Button>
          </div>
        }
      />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload}
      />

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, ID, or department..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><Filter size={18} className="mr-2"/> Filter</Button>
          <div className="flex border-l border-r border-gray-300 px-2 gap-2">
            <Button variant="outline" onClick={handleImportClick}>
                <Upload size={18} className="mr-2"/> Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
                <Download size={18} className="mr-2"/> Export
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
            <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map(emp => (
            <Card key={emp.id} className="flex flex-col items-center text-center hover:shadow-md transition-shadow relative">
              <div 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100"
                onClick={() => openEditModal(emp)}
              >
                <Edit2 size={16} />
              </div>
              <img src={emp.avatar || 'https://picsum.photos/200'} alt={emp.firstName} className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white shadow-sm" />
              <h3 className="text-lg font-bold text-gray-900">{emp.firstName} {emp.lastName}</h3>
              <p className="text-sm text-blue-600 mb-1">{emp.designation}</p>
              <p className="text-xs text-gray-500 mb-4">{emp.department}</p>
              <div className="flex gap-2 mb-4 w-full justify-center">
                 <Badge color={emp.status === 'Active' ? 'green' : emp.status === 'Terminated' ? 'red' : 'yellow'}>{emp.status}</Badge>
              </div>
              <div className="w-full pt-4 border-t border-gray-100 flex justify-around text-gray-500">
                <button className="hover:text-blue-600"><Mail size={18} /></button>
                <button className="hover:text-blue-600"><Phone size={18} /></button>
                <button className="hover:text-blue-600"><MapPin size={18} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full object-cover" src={emp.avatar || 'https://picsum.photos/200'} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-gray-500">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{emp.designation}</div>
                      <div className="text-xs text-gray-500">{emp.department} • {emp.division}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={emp.status === 'Active' ? 'green' : emp.status === 'Terminated' ? 'red' : 'yellow'}>{emp.status}</Badge>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.joiningDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openEditModal(emp)}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ADD/EDIT EMPLOYEE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? "Add New Employee" : "Employee Details"} size="4xl">
        <form onSubmit={handleSubmit} className="flex flex-col h-[75vh]">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                type="button"
                className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === idx ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
            
            {/* --- TAB 1: BASIC INFO --- */}
            {activeTab === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-medium text-gray-700">Employee ID <span className="text-red-500">*</span></label>
                     <input name="id" value={formData.id || ''} onChange={handleInputChange} disabled={modalMode === 'edit'} className={`w-full border p-2 rounded text-sm ${errors.id ? 'border-red-500' : ''}`} />
                     {errors.id && <span className="text-xs text-red-500">{errors.id}</span>}
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                     <input name="email" value={formData.email || ''} type="email" onChange={handleInputChange} className={`w-full border p-2 rounded text-sm ${errors.email ? 'border-red-500' : ''}`} />
                     {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                     <input name="firstName" value={formData.firstName || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                     <input name="lastName" value={formData.lastName || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700">Phone Number</label>
                     <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700">Gender</label>
                     <select name="gender" value={formData.gender || 'Other'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                       <option value="Male">Male</option>
                       <option value="Female">Female</option>
                       <option value="Other">Other</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700">Date of Birth</label>
                     <input name="dateOfBirth" value={formData.dateOfBirth || ''} type="date" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700">Age (Auto-calc)</label>
                     <input name="age" value={formData.age || ''} disabled className="w-full border p-2 rounded text-sm bg-gray-100" />
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 2: EMPLOYMENT --- */}
            {activeTab === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Joining Date <span className="text-red-500">*</span></label>
                   <input name="joiningDate" value={formData.joiningDate || ''} type="date" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Termination Date</label>
                   <input name="terminationDate" value={formData.terminationDate || ''} type="date" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Employment Status</label>
                   <select name="status" value={formData.status || 'Active'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                     <option value="Active">Active</option>
                     <option value="Inactive">Inactive</option>
                     <option value="Terminated">Terminated</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Employment Type</label>
                   <select name="employmentType" value={formData.employmentType || 'Regular'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                     <option value="Regular">Regular</option>
                     <option value="Temporary">Temporary</option>
                     <option value="Contract">Contract</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Probation End Date</label>
                   <input name="probationEndDate" value={formData.probationEndDate || ''} type="date" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Confirmation Status</label>
                   <select name="confirmationStatus" value={formData.confirmationStatus || 'Pending'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                     <option value="Confirmed">Confirmed</option>
                     <option value="Pending">Pending</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Notice Period (Days)</label>
                   <input name="noticePeriod" value={formData.noticePeriod || ''} type="number" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Work Location</label>
                   <input name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
              </div>
            )}

            {/* --- TAB 3: JOB & ORG --- */}
            {activeTab === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Designation <span className="text-red-500">*</span></label>
                   <input name="designation" value={formData.designation || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Division</label>
                   <input name="division" value={formData.division || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Department</label>
                   <input name="department" value={formData.department || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Cost Centre Code</label>
                   <input name="costCentreCode" value={formData.costCentreCode || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Reporting Manager ID</label>
                   <input name="managerId" value={formData.managerId || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" placeholder="Enter Manager ID to link" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Manager Name</label>
                   <input name="managerName" value={formData.managerName || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm bg-gray-50" readOnly />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Grade</label>
                   <input name="grade" value={formData.grade || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Job Family</label>
                   <input name="jobFamily" value={formData.jobFamily || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div className="flex items-center mt-6">
                   <input name="highRiskRole" type="checkbox" checked={formData.highRiskRole || false} onChange={handleInputChange} className="h-4 w-4 text-blue-600 rounded" />
                   <label className="ml-2 block text-sm text-gray-900">High Risk Role</label>
                 </div>
              </div>
            )}

            {/* --- TAB 4: COMPENSATION --- */}
            {activeTab === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Base Salary</label>
                   <input name="baseSalary" value={formData.baseSalary || ''} type="number" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Salary Frequency</label>
                   <select name="salaryFrequency" value={formData.salaryFrequency || 'Monthly'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                     <option value="Monthly">Monthly</option>
                     <option value="Annual">Annual</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">CTC</label>
                   <input name="ctc" value={formData.ctc || ''} type="number" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Currency</label>
                   <input name="currency" value={formData.currency || 'USD'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div className="col-span-2 border-t pt-4 mt-2">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">Salary Range</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500">Min</label>
                        <input name="salaryRangeMin" value={formData.salaryRangeMin || ''} type="number" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Mid</label>
                        <input name="salaryRangeMid" value={formData.salaryRangeMid || ''} type="number" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Max</label>
                        <input name="salaryRangeMax" value={formData.salaryRangeMax || ''} type="number" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                      </div>
                    </div>
                 </div>
              </div>
            )}

            {/* --- TAB 5: WORK CONDITIONS --- */}
            {activeTab === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Weekly Hours</label>
                   <input name="weeklyHours" value={formData.weeklyHours || ''} type="number" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Contract Type</label>
                   <select name="contractType" value={formData.contractType || 'Full-time'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                     <option value="Full-time">Full-time</option>
                     <option value="Part-time">Part-time</option>
                     <option value="Contract">Contract</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-700">Holiday Calendar</label>
                   <select name="holidayCalendar" value={formData.holidayCalendar || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                     <option value="">Select Region</option>
                     <option value="India">India</option>
                     <option value="US">US</option>
                     <option value="UK">UK</option>
                     <option value="Middle East">Middle East</option>
                     <option value="ANZ">ANZ</option>
                     <option value="APAC">APAC</option>
                     <option value="EU">EU</option>
                   </select>
                 </div>
              </div>
            )}

            {/* --- TAB 6: TRACKING & META --- */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                     <h4 className="text-sm font-bold text-gray-800 border-b pb-1 mb-2">Conversation Tracking</h4>
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-gray-700">Last Conversation Date</label>
                      <input name="lastConversationDate" value={formData.lastConversationDate || ''} type="date" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-gray-700">Type</label>
                      <input name="conversationType" value={formData.conversationType || ''} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" placeholder="e.g. Q1 Check-in" />
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-gray-700">Manager Confirmation</label>
                      <select name="managerConfirmationStatus" value={formData.managerConfirmationStatus || 'Pending'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Pending">Pending</option>
                      </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                   <div className="col-span-2">
                      <h4 className="text-sm font-bold text-gray-800 border-b pb-1 mb-2">System Metadata</h4>
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-gray-500">Record Start Date</label>
                     <input name="recordStartDate" value={formData.recordStartDate || ''} type="date" onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-gray-500">Record Status</label>
                     <select name="recordStatus" value={formData.recordStatus || 'Active'} onChange={handleInputChange} className="w-full border p-2 rounded text-sm">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-gray-500">Last Modified</label>
                     <span className="block text-sm p-2">{formData.lastModifiedDate || 'N/A'}</span>
                   </div>
                </div>
              </div>
            )}

          </div>

          <div className="pt-4 border-t border-gray-200 mt-4 flex justify-end space-x-3">
             <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button type="submit" variant="primary"><Save size={16} className="mr-2"/> {modalMode === 'add' ? 'Save Employee' : 'Update Details'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};