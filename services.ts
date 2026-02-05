import { 
  MOCK_EMPLOYEES, MOCK_PAYROLL, MOCK_GOALS, MOCK_REVIEWS, 
  MOCK_ONBOARDING, MOCK_PLANS, MOCK_EMPLOYEE_BENEFITS, MOCK_CANDIDATES, MOCK_JOBS, MOCK_INTERVIEWS
} from './mockData';
import { Employee, PayrollRecord, PerformanceGoal, OnboardingTask, BenefitPlan, Candidate, Job, Interview } from './types';

// Simulating API Latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const EmployeeService = {
  getAll: async (): Promise<Employee[]> => {
    await delay(300);
    return MOCK_EMPLOYEES;
  },
  getById: async (id: string): Promise<Employee | undefined> => {
    await delay(200);
    return MOCK_EMPLOYEES.find(e => e.id === id);
  }
};

export const ATSService = {
  getJobs: async (): Promise<Job[]> => {
    await delay(200);
    return MOCK_JOBS;
  },
  getCandidates: async (): Promise<Candidate[]> => {
    await delay(200);
    return MOCK_CANDIDATES;
  },
  getCandidatesByJob: async (jobId: string): Promise<Candidate[]> => {
    await delay(200);
    return MOCK_CANDIDATES.filter(c => c.jobId === jobId);
  },
  getInterviews: async (): Promise<Interview[]> => {
    await delay(200);
    return MOCK_INTERVIEWS;
  },
  updateCandidateStage: async (candidateId: string, stage: Candidate['stage']): Promise<void> => {
    await delay(300);
    // In a real app, this would make an API call
    console.log(`Moved candidate ${candidateId} to ${stage}`);
  }
};

export const PayrollService = {
  getRecords: async (): Promise<PayrollRecord[]> => {
    await delay(400);
    return MOCK_PAYROLL;
  },
  runPayroll: async (period: string): Promise<PayrollRecord[]> => {
    await delay(1500); // Simulate processing time
    // Mock logic to generate new records
    const newRecords: PayrollRecord[] = MOCK_EMPLOYEES.map(emp => ({
      id: `PR-${Math.random().toString(36).substr(2, 9)}`,
      employeeId: emp.id,
      period,
      grossPay: Math.round(emp.baseSalary / 12),
      taxes: Math.round((emp.baseSalary / 12) * 0.24),
      benefits: 500,
      netPay: Math.round((emp.baseSalary / 12) * 0.76 - 500),
      status: 'Pending'
    }));
    return newRecords;
  }
};

export const PerformanceService = {
  getGoals: async (employeeId: string): Promise<PerformanceGoal[]> => {
    await delay(300);
    return MOCK_GOALS.filter(g => g.employeeId === employeeId);
  },
  getReviews: async (employeeId: string) => {
    await delay(300);
    return MOCK_REVIEWS.filter(r => r.employeeId === employeeId);
  }
};

export const OnboardingService = {
  getTasks: async (employeeId: string): Promise<OnboardingTask[]> => {
    await delay(300);
    return MOCK_ONBOARDING.filter(t => t.employeeId === employeeId);
  }
};

export const BenefitsService = {
  getPlans: async (): Promise<BenefitPlan[]> => {
    await delay(200);
    return MOCK_PLANS;
  },
  getMyBenefits: async (employeeId: string) => {
    await delay(300);
    return MOCK_EMPLOYEE_BENEFITS.filter(b => b.employeeId === employeeId);
  }
};

export const AIService = {
  rankCandidates: async (candidates: Candidate[]): Promise<Candidate[]> => {
    await delay(1000); // Simulate AI processing
    // Simple mock logic: prioritize those with "Engineer" in title
    return [...candidates].sort((a, b) => {
      const aScore = a.aiMatchScore || 0;
      const bScore = b.aiMatchScore || 0;
      return bScore - aScore;
    });
  },
  analyzePerformance: async (goals: PerformanceGoal[]) => {
    await delay(800);
    const completed = goals.filter(g => g.status === 'Completed').length;
    if (completed / goals.length > 0.6) return "High Performer: Consistently exceeding targets.";
    return "Steady Performer: Meeting expectations but room for growth.";
  },
  parseResume: async (file: File) => {
    await delay(1500);
    // Mock parsing result
    return {
      skills: ['React', 'TypeScript', 'Project Management'],
      experience: 5,
      education: 'Bachelor in Computer Science'
    };
  }
};