import React, { useState, useEffect } from 'react';
import { BenefitsService } from '../services';
import { BenefitPlan, EmployeeBenefit } from '../types';
import { Card, SectionHeader, Button, Badge } from '../components';
import { Heart, Smile, Eye, ShieldCheck } from 'lucide-react';

export const Benefits = () => {
  const [plans, setPlans] = useState<BenefitPlan[]>([]);
  const [myBenefits, setMyBenefits] = useState<EmployeeBenefit[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock employee ID
  const VIEW_EMPLOYEE_ID = 'EMP003';

  useEffect(() => {
    const load = async () => {
      const [p, b] = await Promise.all([
        BenefitsService.getPlans(),
        BenefitsService.getMyBenefits(VIEW_EMPLOYEE_ID)
      ]);
      setPlans(p);
      setMyBenefits(b);
      setLoading(false);
    };
    load();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Health': return <Heart className="text-red-500" />;
      case 'Dental': return <Smile className="text-blue-500" />;
      case 'Vision': return <Eye className="text-purple-500" />;
      default: return <ShieldCheck className="text-gray-500" />;
    }
  };

  if (loading) return <div className="p-8">Loading Plans...</div>;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Benefits Administration" 
        description="Enroll in health, dental, and vision plans."
        action={<Button variant="outline">Download Guide</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {plans.map(plan => {
          const isEnrolled = myBenefits.some(b => b.planId === plan.id);
          return (
            <Card key={plan.id} className={`relative border-2 ${isEnrolled ? 'border-green-500 bg-green-50' : 'border-transparent'}`}>
              {isEnrolled && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold">
                  ENROLLED
                </div>
              )}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  {getIcon(plan.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{plan.provider}</p>
                  <p className="text-sm text-gray-700 mb-4">{plan.coverageDetails}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-lg font-bold text-gray-900">
                      ${plan.costToEmployee}<span className="text-xs font-normal text-gray-500">/mo</span>
                    </div>
                    {isEnrolled ? (
                       <Button variant="secondary" size="sm" disabled>Selected</Button>
                    ) : (
                       <Button variant="primary" size="sm">Select Plan</Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
