import React, { useState, useEffect } from 'react';
import { PerformanceService, AIService } from '../services';
import { PerformanceGoal } from '../types';
import { Card, SectionHeader, Button, Badge } from '../components';
import { Target, TrendingUp, Sparkles, Plus } from 'lucide-react';

export const Performance = () => {
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Mock viewing performance for EMP003
  const VIEW_EMPLOYEE_ID = 'EMP003';

  useEffect(() => {
    const fetchData = async () => {
      const data = await PerformanceService.getGoals(VIEW_EMPLOYEE_ID);
      setGoals(data);
      
      // Get AI Insight
      const insight = await AIService.analyzePerformance(data);
      setAiInsight(insight);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Performance Data...</div>;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Performance Management" 
        description="Goal setting, continuous feedback, and 360° reviews." 
        action={<Button variant="primary"><Plus size={16} className="mr-2"/> New Goal</Button>}
      />

      {/* AI Insight Section */}
      <Card className="bg-purple-50 border-purple-100">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-purple-900">AI Performance Insight</h3>
            <p className="text-purple-700 text-sm mt-1">{aiInsight}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals List */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h3 className="font-bold text-gray-900 flex items-center"><Target size={18} className="mr-2"/> OKRs & Goals</h3>
             <span className="text-sm text-gray-500">Q4 2023</span>
           </div>
           {goals.map(goal => (
             <Card key={goal.id} className="border-l-4 border-l-blue-500">
               <div className="flex justify-between items-start mb-2">
                 <h4 className="font-bold text-gray-800">{goal.title}</h4>
                 <Badge color={goal.status === 'Completed' ? 'green' : 'blue'}>{goal.status}</Badge>
               </div>
               <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
               
               <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                 <span>Progress</span>
                 <span>{goal.progress}%</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div 
                   className={`h-2 rounded-full ${goal.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} 
                   style={{ width: `${goal.progress}%` }}
                 ></div>
               </div>
             </Card>
           ))}
        </div>

        {/* Reviews Section */}
        <Card className="h-fit">
           <h3 className="font-bold text-gray-900 mb-4 flex items-center"><TrendingUp size={18} className="mr-2"/> Review Cycles</h3>
           <div className="space-y-4">
             <div className="p-4 border rounded-lg bg-gray-50">
               <div className="flex justify-between items-center mb-2">
                 <span className="font-bold text-gray-700">Q3 2023 Review</span>
                 <Badge color="green">Completed</Badge>
               </div>
               <div className="flex items-center space-x-2 mb-2">
                 <div className="flex text-yellow-400">★★★★½</div>
                 <span className="text-sm text-gray-600">4.5/5.0</span>
               </div>
               <p className="text-sm text-gray-600 italic">"Excellent delivery speed and code quality..."</p>
               <Button variant="outline" size="sm" className="mt-3 w-full">View Full Report</Button>
             </div>
             
             <div className="p-4 border border-dashed rounded-lg flex items-center justify-center text-gray-500 text-sm">
               Next Cycle: Annual Review (Dec 2023)
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
};
