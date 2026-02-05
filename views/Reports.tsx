import React, { useState } from 'react';
import { Card, SectionHeader, Button } from '../components';
import { FileSpreadsheet, Download, FileText, BarChart, Upload, CheckSquare, Square } from 'lucide-react';
import { MOCK_PAYROLL, MOCK_CANDIDATES, MOCK_TIMESHEETS, MOCK_EMPLOYEES, MOCK_LEAVES, MOCK_JOBS } from '../mockData';
import * as XLSX from 'xlsx';

// Simple Icons defined outside component to prevent re-declaration issues
const DollarSignIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export const Reports = () => {
  // Custom Report Builder State
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const modules = [
    { id: 'Employees', label: 'Employee Directory', data: MOCK_EMPLOYEES },
    { id: 'Payroll', label: 'Payroll Records', data: MOCK_PAYROLL },
    { id: 'Recruitment', label: 'ATS Candidates', data: MOCK_CANDIDATES },
    { id: 'Timesheets', label: 'Time & Attendance', data: MOCK_TIMESHEETS },
    { id: 'Leaves', label: 'Leave Requests', data: MOCK_LEAVES },
  ];

  const downloadExcel = (data: any[], sheetName: string, fileName: string) => {
    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (e) {
      console.error("Excel generation failed", e);
      alert("Failed to generate Excel file.");
    }
  };

  const handleDownloadPayroll = () => {
    downloadExcel(MOCK_PAYROLL, 'Payroll', 'Nexus_Payroll_Report');
  };

  const handleDownloadATS = () => {
    const atsData = MOCK_CANDIDATES.map(c => {
      const job = (MOCK_JOBS || []).find(j => j.id === c.jobId);
      return {
        Name: `${c.firstName} ${c.lastName}`,
        Email: c.email,
        Position: job ? job.title : 'Unknown',
        Stage: c.stage,
        Rating: c.rating,
        'Applied Date': c.appliedDate
      };
    });
    downloadExcel(atsData, 'Candidates', 'Nexus_Recruitment_Tracker');
  };

  const handleDownloadTimesheets = () => {
    downloadExcel(MOCK_TIMESHEETS, 'Timesheets', 'Nexus_Timesheet_Report');
  };

  // --- Custom Builder Logic ---

  const toggleModule = (id: string) => {
    if (selectedModules.includes(id)) {
      setSelectedModules(selectedModules.filter(m => m !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTemplateFile(e.target.files[0]);
    }
  };

  const generateCustomReport = async () => {
    if (selectedModules.length === 0) {
      alert("Please select at least one data module.");
      return;
    }

    setIsGenerating(true);
    
    try {
      let wb: XLSX.WorkBook;

      // 1. Load Template or Create New
      if (templateFile) {
        const data = await templateFile.arrayBuffer();
        wb = XLSX.read(data);
      } else {
        wb = XLSX.utils.book_new();
      }

      // 2. Append Selected Data as Sheets
      selectedModules.forEach(moduleId => {
        const module = modules.find(m => m.id === moduleId);
        if (module) {
          // Normalize data for specific modules if needed
          let sheetData: any[] = module.data;
          
          if (moduleId === 'Recruitment') {
             sheetData = MOCK_CANDIDATES.map(c => {
                const job = (MOCK_JOBS || []).find(j => j.id === c.jobId);
                return {
                  Name: `${c.firstName} ${c.lastName}`, 
                  Email: c.email, 
                  Position: job ? job.title : 'Unknown', 
                  Stage: c.stage, 
                  Rating: c.rating, 
                  Date: c.appliedDate
                };
            });
          }

          const ws = XLSX.utils.json_to_sheet(sheetData);
          
          // Handle duplicate sheet names if template already has them
          let sheetName = moduleId;
          if (wb.SheetNames.includes(sheetName)) {
            sheetName = `${moduleId}_Data`;
          }
          
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }
      });

      // 3. Download
      const fileName = templateFile 
        ? `Report_${templateFile.name}` 
        : `Custom_Nexus_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
        
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Failed to process the template file. Please ensure it is a valid .xlsx file.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Reports & Analytics" 
        description="Generate and export system reports." 
      />

      {/* Quick Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <Card className="flex flex-col justify-between h-full hover:border-blue-500 transition-colors cursor-pointer border-dashed border-2 border-gray-200">
          <div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg w-fit mb-4">
              <DollarSignIcon />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Payroll Register</h3>
            <p className="text-sm text-gray-500 mb-6">
              Complete breakdown of gross pay, taxes, benefits, and net pay.
            </p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleDownloadPayroll}>
            <Download size={16} className="mr-2" /> Download .XLSX
          </Button>
        </Card>

        <Card className="flex flex-col justify-between h-full hover:border-blue-500 transition-colors cursor-pointer border-dashed border-2 border-gray-200">
          <div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg w-fit mb-4">
              <UsersIcon />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Recruitment Tracker</h3>
            <p className="text-sm text-gray-500 mb-6">
              List of all candidates including current stage, ratings, and dates.
            </p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleDownloadATS}>
            <Download size={16} className="mr-2" /> Download .XLSX
          </Button>
        </Card>

        <Card className="flex flex-col justify-between h-full hover:border-blue-500 transition-colors cursor-pointer border-dashed border-2 border-gray-200">
          <div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg w-fit mb-4">
              <ClockIcon />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Timesheet Export</h3>
            <p className="text-sm text-gray-500 mb-6">
              Detailed log of employee work hours and project allocation.
            </p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleDownloadTimesheets}>
            <Download size={16} className="mr-2" /> Download .XLSX
          </Button>
        </Card>

      </div>
      
      {/* Custom Report Builder */}
      <Card className="bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 pb-4">
            <BarChart className="text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Custom Report Builder</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Selection */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">1. Select Data Modules</h4>
              <div className="space-y-3">
                {modules.map(module => {
                  const isSelected = selectedModules.includes(module.id);
                  return (
                    <div 
                      key={module.id} 
                      onClick={() => toggleModule(module.id)}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-200 text-blue-900' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`mr-3 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                      <span className="font-medium">{module.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Template & Action */}
            <div className="flex flex-col h-full">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">2. Options & Generate</h4>
              
              <div className="flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center mb-6">
                <Upload className="text-gray-400 mb-2" size={32} />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {templateFile ? templateFile.name : "Upload Excel Template (Optional)"}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {templateFile 
                    ? "Template loaded. Data will be appended as new sheets." 
                    : "Use an existing .xlsx file as a base for your report."}
                </p>
                
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="secondary" size="sm">
                    {templateFile ? "Change File" : "Choose File"}
                  </Button>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={generateCustomReport}
                disabled={isGenerating || selectedModules.length === 0}
              >
                {isGenerating ? "Processing..." : "Generate Custom Report"}
              </Button>
            </div>
          </div>
      </Card>
    </div>
  );
};