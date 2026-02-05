import React, { useState, useEffect, useRef } from 'react';
import { LeaveRequest } from '../types';
import { Card, Badge, Button, SectionHeader, Modal } from '../components';
import { Clock, Calendar, Play, Square, Coffee, Briefcase } from 'lucide-react';
import { MOCK_TIMESHEETS } from '../mockData';

interface TimeLeaveProps {
  leaves: LeaveRequest[];
}

export const TimeLeave: React.FC<TimeLeaveProps> = ({ leaves }) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave'>('attendance');
  const [isModalOpen, setModalOpen] = useState(false);

  // Timer State
  const [clockedIn, setClockedIn] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timesheets, setTimesheets] = useState(MOCK_TIMESHEETS);
  const [selectedProject, setSelectedProject] = useState('Nexus HRMS Development');

  // Format seconds into HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Format date to locale time string
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Timer Logic
  useEffect(() => {
    let intervalId: any;

    if (clockedIn && startTime) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [clockedIn, startTime]);

  const handleClockAction = () => {
    if (!clockedIn) {
      // CLOCK IN
      setStartTime(Date.now());
      setClockedIn(true);
      setElapsedSeconds(0);
    } else {
      // CLOCK OUT
      if (startTime) {
        const endTime = Date.now();
        const newEntry = {
          date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          in: formatTime(new Date(startTime)),
          out: formatTime(new Date(endTime)),
          proj: selectedProject,
          total: formatDuration(elapsedSeconds),
          status: 'Pending'
        };

        setTimesheets([newEntry, ...timesheets]);
        
        // Reset State
        setClockedIn(false);
        setStartTime(null);
        setElapsedSeconds(0);
      }
    }
  };

  return (
    <div>
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-6">
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'attendance' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Time & Attendance
        </button>
        <button 
          onClick={() => setActiveTab('leave')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'leave' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Leave Management
        </button>
      </div>

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <SectionHeader title="Timesheets" description="Track your work hours and project time." />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Clock Widget */}
            <Card className="flex flex-col items-center justify-center py-10 text-center relative overflow-hidden">
               {/* Pulse Animation Background when active */}
               {clockedIn && (
                 <div className="absolute inset-0 bg-green-50 animate-pulse opacity-50 pointer-events-none"></div>
               )}
              
              <div className="text-gray-500 font-medium mb-2 relative z-10">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              
              {/* Timer Display */}
              <div className={`text-5xl font-mono font-bold mb-8 relative z-10 ${clockedIn ? 'text-green-600' : 'text-gray-900'}`}>
                {formatDuration(elapsedSeconds)}
              </div>
              
              <button 
                onClick={handleClockAction}
                className={`flex items-center justify-center w-40 h-40 rounded-full border-4 transition-all transform hover:scale-105 shadow-lg relative z-10 ${
                  clockedIn 
                    ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'border-green-500 bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                <div className="flex flex-col items-center">
                  {clockedIn ? <Square size={32} className="fill-current mb-2" /> : <Play size={32} className="fill-current mb-2" />}
                  <span className="font-bold text-lg">{clockedIn ? 'CLOCK OUT' : 'CLOCK IN'}</span>
                </div>
              </button>
              
              <div className="mt-6 w-full max-w-xs relative z-10">
                 <label className="block text-xs text-left text-gray-500 mb-1">Current Project</label>
                 <select 
                   className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                   disabled={clockedIn} // Prevent changing project while clock is running
                   value={selectedProject}
                   onChange={(e) => setSelectedProject(e.target.value)}
                 >
                   <option>Nexus HRMS Development</option>
                   <option>Internal Meeting</option>
                   <option>Client Support</option>
                   <option>Design Review</option>
                 </select>
              </div>
            </Card>

            {/* Weekly Summary */}
            <Card className="lg:col-span-2">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-gray-900">Recent Activity</h3>
                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">This Week</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500">
                     <tr>
                       <th className="p-3">Date</th>
                       <th className="p-3">In</th>
                       <th className="p-3">Out</th>
                       <th className="p-3">Project</th>
                       <th className="p-3">Total</th>
                       <th className="p-3">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {timesheets.map((row, i) => (
                       <tr key={i} className={i === 0 && !clockedIn ? "bg-green-50/30" : ""}>
                         <td className="p-3 font-medium">{row.date}</td>
                         <td className="p-3">{row.in}</td>
                         <td className="p-3 text-gray-500">{row.out}</td>
                         <td className="p-3 text-gray-600 truncate max-w-[150px]" title={row.proj}>{row.proj}</td>
                         <td className="p-3 font-bold">{row.total}</td>
                         <td className="p-3">
                           <Badge color={row.status === 'Approved' ? 'green' : row.status === 'Pending' ? 'yellow' : 'blue'}>{row.status}</Badge>
                         </td>
                       </tr>
                     ))}
                     {clockedIn && (
                       <tr className="bg-green-50 animate-pulse">
                         <td className="p-3 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                         <td className="p-3">{startTime ? formatTime(new Date(startTime)) : '--'}</td>
                         <td className="p-3 text-gray-500">...</td>
                         <td className="p-3 text-green-700 font-medium">{selectedProject}</td>
                         <td className="p-3 font-bold text-green-700">{formatDuration(elapsedSeconds)}</td>
                         <td className="p-3"><Badge color="blue">Active</Badge></td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="space-y-6">
          <SectionHeader 
             title="Leave Management" 
             description="View balances and request time off." 
             action={<Button variant="primary" onClick={() => setModalOpen(true)}><Calendar size={16} className="mr-2" /> Request Time Off</Button>}
          />
          
          {/* Balances */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                <div className="flex justify-between items-start">
                   <div>
                     <p className="text-blue-100 text-sm">PTO Balance</p>
                     <h3 className="text-3xl font-bold mt-1">12 Days</h3>
                   </div>
                   <Coffee className="text-blue-200" size={24} />
                </div>
                <div className="mt-4 text-xs text-blue-100 bg-blue-700 bg-opacity-30 inline-block px-2 py-1 rounded">
                   Accrual: 1.25 days/month
                </div>
             </Card>
             <Card>
                <div className="flex justify-between items-start">
                   <div>
                     <p className="text-gray-500 text-sm">Sick Leave</p>
                     <h3 className="text-3xl font-bold mt-1 text-gray-900">5 Days</h3>
                   </div>
                   <div className="p-2 bg-red-50 rounded-lg text-red-500"><Square size={20} /></div>
                </div>
             </Card>
             <Card>
                <div className="flex justify-between items-start">
                   <div>
                     <p className="text-gray-500 text-sm">Remote Work</p>
                     <h3 className="text-3xl font-bold mt-1 text-gray-900">Unlimited</h3>
                   </div>
                   <div className="p-2 bg-purple-50 rounded-lg text-purple-500"><Briefcase size={20} /></div>
                </div>
             </Card>
          </div>

          <Card>
            <h3 className="font-bold text-gray-900 mb-4">Leave History</h3>
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-500">
                 <tr>
                   <th className="p-3">Type</th>
                   <th className="p-3">Duration</th>
                   <th className="p-3">Dates</th>
                   <th className="p-3">Reason</th>
                   <th className="p-3">Status</th>
                   <th className="p-3 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {leaves.map(leave => (
                   <tr key={leave.id}>
                     <td className="p-3 font-medium">{leave.type}</td>
                     <td className="p-3">
                       {Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 3600 * 24))} Days
                     </td>
                     <td className="p-3 text-gray-500">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                     <td className="p-3 text-gray-500 max-w-xs truncate">{leave.reason}</td>
                     <td className="p-3">
                       <Badge color={leave.status === 'Approved' ? 'green' : leave.status === 'Rejected' ? 'red' : 'yellow'}>{leave.status}</Badge>
                     </td>
                     <td className="p-3 text-right">
                       {leave.status === 'Pending' && <button className="text-red-600 text-xs hover:underline">Cancel</button>}
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Modal for Leave Request */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="New Leave Request" size="lg">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
              <option>Paid Time Off (PTO)</option>
              <option>Sick Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" />
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" rows={3}></textarea>
          </div>
          <div className="pt-2">
            <Button className="w-full">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};