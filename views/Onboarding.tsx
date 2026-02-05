import React, { useEffect, useState } from 'react';
import { OnboardingService } from '../services';
import { OnboardingTask } from '../types';
import { Card, SectionHeader, Button, Badge } from '../components';
import { CheckCircle, Circle, FileText, User } from 'lucide-react';

export const Onboarding = () => {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock: viewing tasks for EMP005 (Emily Davis)
  const VIEW_EMPLOYEE_ID = 'EMP005';

  useEffect(() => {
    const loadTasks = async () => {
      const data = await OnboardingService.getTasks(VIEW_EMPLOYEE_ID);
      setTasks(data);
      setLoading(false);
    };
    loadTasks();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading workflows...</div>;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Onboarding & Offboarding" 
        description="Manage automated workflows for new hires and exiting employees." 
        action={<Button variant="primary">Create Workflow</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Emily Davis</h3>
              <p className="text-blue-100 text-sm">Marketing • Started Apr 5, 2023</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Onboarding Progress</span>
              <span>66%</span>
            </div>
            <div className="w-full bg-blue-900 bg-opacity-30 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>
        </Card>

        {/* Task List */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Action Items</h3>
          <div className="space-y-0 divide-y divide-gray-100">
            {tasks.map(task => (
              <div key={task.id} className="py-4 flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  {task.status === 'Completed' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Circle className="text-gray-300" size={20} />
                  )}
                  <div>
                    <p className={`font-medium ${task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                   {task.assigneeId && <Badge color="blue">Assigned to Manager</Badge>}
                   {task.title.includes('Sign') && <Button size="sm" variant="outline"><FileText size={14} className="mr-1"/> Sign</Button>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Templates Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
         {['Engineering Onboarding', 'Sales Onboarding', 'Exit Checklist'].map((template, i) => (
           <Card key={i} className="hover:border-blue-500 cursor-pointer transition-colors border-dashed">
             <div className="flex items-center justify-between mb-2">
               <FileText className="text-gray-400" />
               <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Template</span>
             </div>
             <h4 className="font-bold text-gray-900">{template}</h4>
             <p className="text-sm text-gray-500 mt-1">12 tasks • 3 documents</p>
           </Card>
         ))}
      </div>
    </div>
  );
};
