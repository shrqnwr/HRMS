import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserPlus, Clock, Calendar, DollarSign, 
  BarChart2, Settings, Bell, Menu, X, LogOut, ChevronDown, 
  Heart, ClipboardCheck, PieChart, Search 
} from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_CANDIDATES, MOCK_LEAVES } from './mockData';
import { Dashboard } from './views/Dashboard';
import { CoreHR } from './views/CoreHR';
import { ATS } from './views/ATS';
import { TimeLeave } from './views/TimeLeave';
import { Payroll } from './views/Payroll';
import { Performance } from './views/Performance';
import { Onboarding } from './views/Onboarding';
import { Benefits } from './views/Benefits';
import { Reports } from './views/Reports';
import { Role, View } from './types';
import { Button } from './components';

const App = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [role, setRole] = useState<Role>('ADMIN');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentUser = MOCK_EMPLOYEES.find(e => e.role === role) || MOCK_EMPLOYEES[0];

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'DASHBOARD' as View, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'People', icon: Users, view: 'EMPLOYEES' as View, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Recruiting', icon: UserPlus, view: 'RECRUITMENT' as View, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Onboarding', icon: ClipboardCheck, view: 'ONBOARDING' as View, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Time & Off', icon: Clock, view: 'TIME' as View, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Payroll', icon: DollarSign, view: 'PAYROLL' as View, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Benefits', icon: Heart, view: 'BENEFITS' as View, roles: ['ADMIN', 'EMPLOYEE'] },
    { name: 'Performance', icon: BarChart2, view: 'PERFORMANCE' as View, roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Insights', icon: PieChart, view: 'REPORTS' as View, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Settings', icon: Settings, view: 'SETTINGS' as View, roles: ['ADMIN'] },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard role={role} onNavigate={setCurrentView} />;
      case 'EMPLOYEES': return <CoreHR employees={MOCK_EMPLOYEES} />;
      case 'RECRUITMENT': return <ATS candidates={MOCK_CANDIDATES} />;
      case 'TIME': return <TimeLeave leaves={MOCK_LEAVES} />;
      case 'PAYROLL': return <Payroll />;
      case 'PERFORMANCE': return <Performance />;
      case 'ONBOARDING': return <Onboarding />;
      case 'BENEFITS': return <Benefits />;
      case 'REPORTS': return <Reports />;
      case 'SETTINGS': return <div className="p-12 text-center text-[#5f6368]">Settings Module Placeholder</div>;
      default: return <div className="p-4">Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fa]">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar - Modern Light Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#dadce0] transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-20 px-6 border-b border-transparent">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
             <span className="text-[22px] font-google-sans text-[#454746]">Nexus<span className="font-bold text-[#1f1f1f]">HR</span></span>
          </div>
        </div>
        
        <div className="flex flex-col h-[calc(100%-5rem)] px-3 py-2">
          {/* Role Switcher (Simulated) */}
          <div className="mb-6 px-3">
            <div className="relative">
                <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full appearance-none bg-[#f1f3f4] text-[#3c4043] text-sm font-medium rounded-xl border-none py-3 px-4 focus:ring-2 focus:ring-[#1a73e8] outline-none cursor-pointer hover:bg-[#e8eaed] transition-colors"
                >
                <option value="ADMIN">View as Admin</option>
                <option value="MANAGER">View as Manager</option>
                <option value="EMPLOYEE">View as Employee</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-[#5f6368] pointer-events-none" size={16} />
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
            {navigation.map((item) => {
              if (!item.roles.includes(role)) return null;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setCurrentView(item.view);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-[14px] font-medium rounded-full transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#e8f0fe] text-[#1967d2]' 
                      : 'text-[#444746] hover:bg-[#f1f3f4] hover:text-[#1f1f1f]'
                  }`}
                >
                  <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-[#1967d2]' : 'text-[#444746]'}`} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          <div className="pt-4 mt-4 border-t border-[#dadce0] px-3">
            <button className="flex items-center w-full px-4 py-3 text-[14px] font-medium text-[#444746] hover:bg-[#f1f3f4] rounded-full transition-colors">
              <LogOut className="mr-4 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-[#f8f9fa]">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#dadce0] z-10 sticky top-0">
          <div className="flex items-center justify-between h-20 px-4 sm:px-8">
            <div className="flex items-center">
                <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-full text-[#5f6368] hover:bg-[#f1f3f4] focus:outline-none mr-2"
                >
                <Menu size={24} />
                </button>
                
                {/* Global Search Bar */}
                <div className="hidden md:flex items-center bg-[#f1f3f4] rounded-full px-4 py-2.5 w-96 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-[#dadce0] focus-within:shadow-sm">
                    <Search size={18} className="text-[#5f6368] mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search employees, jobs, or actions..." 
                        className="bg-transparent border-none outline-none text-sm w-full text-[#3c4043] placeholder-[#80868b]"
                    />
                </div>
            </div>
            
            <div className="flex items-center space-x-3">
               <button className="p-2.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full relative transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-[#d93025] ring-2 ring-white"></span>
               </button>
               
               <div className="relative ml-2">
                 <button 
                   onClick={() => setIsProfileOpen(!isProfileOpen)}
                   className="flex items-center space-x-3 focus:outline-none p-1 pr-3 rounded-full hover:bg-[#f1f3f4] border border-transparent hover:border-[#dadce0] transition-all"
                 >
                   <img className="h-8 w-8 rounded-full object-cover border border-[#dadce0]" src={currentUser.avatar} alt="User" />
                   <div className="text-left hidden sm:block">
                     <p className="text-sm font-medium text-[#3c4043] leading-none">{currentUser.firstName}</p>
                   </div>
                   <ChevronDown size={16} className="text-[#5f6368]" />
                 </button>

                 {/* Dropdown */}
                 {isProfileOpen && (
                   <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                     <div className="px-4 py-3 border-b border-[#f1f3f4] mb-2">
                        <p className="text-sm font-medium text-[#202124]">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-[#5f6368] truncate">{currentUser.email}</p>
                     </div>
                     <a href="#" className="block px-4 py-2.5 text-sm text-[#3c4043] hover:bg-[#f1f3f4]">Your Profile</a>
                     <a href="#" className="block px-4 py-2.5 text-sm text-[#3c4043] hover:bg-[#f1f3f4]">Account Settings</a>
                     <div className="border-t border-[#f1f3f4] my-1"></div>
                     <a href="#" className="block px-4 py-2.5 text-sm text-[#d93025] hover:bg-[#fce8e6]">Sign out</a>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden focus:outline-none flex flex-col">
           <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
             {/* Removed max-w constraint to use full real estate */}
             <div className="w-full h-full flex flex-col">
               {renderContent()}
             </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;