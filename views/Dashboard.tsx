import React from 'react';
import { Users, Briefcase, DollarSign, Clock, Calendar, TrendingUp } from 'lucide-react';
import { StatCard, Card, SectionHeader, Button } from '../components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Role, View } from '../types';

interface DashboardProps {
  role: Role;
  onNavigate: (view: View) => void;
}

const data = [
  { name: 'Jan', headcount: 40, turnover: 2 },
  { name: 'Feb', headcount: 42, turnover: 1 },
  { name: 'Mar', headcount: 45, turnover: 0 },
  { name: 'Apr', headcount: 44, turnover: 3 },
  { name: 'May', headcount: 48, turnover: 1 },
  { name: 'Jun', headcount: 52, turnover: 0 },
];

export const Dashboard: React.FC<DashboardProps> = ({ role, onNavigate }) => {
  return (
    <div className="space-y-8">
      <SectionHeader 
        title={`Good morning, ${role === 'ADMIN' ? 'Admin' : role === 'MANAGER' ? 'Manager' : 'User'}`} 
        description="Here's a summary of your organization today."
        action={<Button variant="primary" size="lg">Generate Report</Button>}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value="142" trend="+12% vs last month" icon={Users} color="blue" />
        <StatCard title="Open Positions" value="8" trend="3 urgent hiring" icon={Briefcase} color="purple" />
        <StatCard title="On Leave Today" value="5" trend="2 sick leave" icon={Calendar} color="orange" />
        {role !== 'EMPLOYEE' && (
          <StatCard title="Payroll Run" value="$284k" trend="Due in 5 days" icon={DollarSign} color="green" />
        )}
      </div>

      {/* Charts Section */}
      {role !== 'EMPLOYEE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-[400px] flex flex-col">
            <h3 className="text-[18px] font-google-sans text-[#202124] mb-6">Headcount Growth</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5f6368', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#5f6368', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="headcount" stroke="#1a73e8" strokeWidth={3} dot={{r: 4, fill: '#1a73e8', strokeWidth: 2, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="h-[400px] flex flex-col">
            <h3 className="text-[18px] font-google-sans text-[#202124] mb-6">Department Distribution</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Eng', val: 45 }, { name: 'Sales', val: 30 }, { name: 'Mkt', val: 20 }, { name: 'HR', val: 8 }, { name: 'Ops', val: 12 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5f6368', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#5f6368', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} cursor={{fill: '#f1f3f4', radius: 4}} />
                  <Bar dataKey="val" fill="#a142f4" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions / Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[18px] font-google-sans text-[#202124]">Recent Activity</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-2">
            {[
              { text: "Sarah Williams applied for PTO (Nov 20 - Nov 25)", time: "2 hours ago", icon: Calendar, color: "bg-[#feefe3] text-[#ea8600]" },
              { text: "New candidate 'John Doe' moved to Interview stage", time: "4 hours ago", icon: Users, color: "bg-[#e8f0fe] text-[#1967d2]" },
              { text: "October Payroll report is ready for review", time: "1 day ago", icon: DollarSign, color: "bg-[#e6f4ea] text-[#137333]" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-4 hover:bg-[#f8f9fa] rounded-2xl transition-colors cursor-pointer group">
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#202124] group-hover:text-[#1a73e8] transition-colors">{item.text}</p>
                  <p className="text-[12px] text-[#5f6368] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-[18px] font-google-sans text-[#202124] mb-6">Quick Links</h3>
          <div className="space-y-3">
             <Button variant="outline" className="w-full justify-start py-3" onClick={() => onNavigate('TIME')}>
               <Clock className="mr-3 h-5 w-5 text-[#5f6368]" /> Clock In / Out
             </Button>
             <Button variant="outline" className="w-full justify-start py-3" onClick={() => onNavigate('TIME')}>
               <Calendar className="mr-3 h-5 w-5 text-[#5f6368]" /> Request Time Off
             </Button>
             {(role === 'ADMIN' || role === 'MANAGER') && (
               <Button variant="outline" className="w-full justify-start py-3" onClick={() => onNavigate('RECRUITMENT')}>
                 <Briefcase className="mr-3 h-5 w-5 text-[#5f6368]" /> View Open Jobs
               </Button>
             )}
             <Button variant="outline" className="w-full justify-start py-3" onClick={() => onNavigate('PERFORMANCE')}>
               <TrendingUp className="mr-3 h-5 w-5 text-[#5f6368]" /> My Performance
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};