export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type View = 'DASHBOARD' | 'EMPLOYEES' | 'RECRUITMENT' | 'TIME' | 'PAYROLL' | 'PERFORMANCE' | 'ONBOARDING' | 'BENEFITS' | 'REPORTS' | 'SETTINGS';

// --- ATS / RECRUITMENT TYPES ---

export type JobStatus = 'Draft' | 'Open' | 'On Hold' | 'Closed';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  status: JobStatus;
  hiringManagerId: string;
  postedDate: string;
  description?: string;
  requirements?: string[];
}

export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface Candidate {
  id: string;
  jobId: string; // Linked Job
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: 'LinkedIn' | 'Referral' | 'Career Page' | 'Indeed';
  resumeUrl?: string;
  skills: string[];
  experienceYears: number;
  stage: CandidateStage;
  rating: number; // 1-5
  aiMatchScore: number; // 0-100
  appliedDate: string;
  tags?: string[];
  notes?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  type: 'Phone' | 'Video' | 'In-Person';
  startDateTime: string;
  endDateTime: string;
  interviewerId: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  meetingLink?: string;
  feedback?: string;
  score?: number;
}

// --- EXISTING TYPES ---

export interface Employee {
  // --- SECTION 1: BASIC INFO ---
  id: string; // employee_id
  firstName: string; // first_name
  lastName: string; // last_name
  email: string;
  phoneNumber?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  age?: number; // Auto-calculated
  avatar?: string; // UI specific

  // --- SECTION 2: EMPLOYMENT DETAILS ---
  joiningDate: string;
  terminationDate?: string;
  status: 'Active' | 'Inactive' | 'Terminated'; // employment_status
  employmentType?: 'Regular' | 'Temporary' | 'Contract';
  probationEndDate?: string;
  confirmationStatus?: 'Confirmed' | 'Pending';
  noticePeriod?: number; // In days
  location: string; // work_location
  workSubLocation?: string;

  // --- SECTION 3: JOB & ORGANIZATION ---
  designation: string;
  division?: string;
  department: string;
  parentDepartment?: string;
  grade?: string;
  payGrade?: string;
  jobLevel?: string;
  jobFamily?: string;
  jobFunction?: string;
  managerId?: string; // manager_employee_id
  managerName?: string;
  managerEmail?: string;
  costCentreCode?: string;
  costCentreName?: string;
  legalEntity?: string;
  companyCode?: string;
  // UI Helper for backward compat
  position?: string; 

  // --- SECTION 4: COMPENSATION ---
  baseSalary: number;
  salaryFrequency?: 'Monthly' | 'Annual';
  ctc?: number;
  salaryRangeMin?: number;
  salaryRangeMid?: number;
  salaryRangeMax?: number;
  currency?: string;

  // --- SECTION 5: WORK CONDITIONS ---
  weeklyHours?: number;
  holidayCalendar?: string;
  highRiskRole?: boolean;
  contractType?: 'Full-time' | 'Part-time' | 'Contract';

  // --- SECTION 6: CONVERSATION TRACKING ---
  lastConversationDate?: string;
  conversationType?: string;
  managerConfirmationStatus?: 'Yes' | 'No' | 'Pending';

  // --- SECTION 7: METADATA ---
  recordStartDate?: string;
  recordEndDate?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  recordStatus?: 'Active' | 'Inactive';
  
  // Role & Access (System)
  role: Role;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'PTO' | 'Sick' | 'Unpaid';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  project?: string;
  totalHours: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  period: string;
  grossPay: number;
  taxes: number;
  benefits: number;
  netPay: number;
  status: 'Processed' | 'Pending';
  paymentDate?: string;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number; // 0-100
  dueDate: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  cycle: string;
  rating: number; // 1-5
  comments: string;
  status: 'Draft' | 'Completed';
}

export interface OnboardingTask {
  id: string;
  employeeId: string; // The new hire
  title: string;
  status: 'Pending' | 'Completed';
  dueDate: string;
  assigneeId?: string; // Who is responsible (e.g., IT for laptop)
}

export interface BenefitPlan {
  id: string;
  name: string;
  type: 'Health' | 'Dental' | 'Vision' | 'Retirement';
  provider: string;
  costToEmployee: number;
  coverageDetails: string;
}

export interface EmployeeBenefit {
  id: string;
  employeeId: string;
  planId: string;
  status: 'Active' | 'Waived';
  enrollmentDate: string;
}

export interface AppState {
  currentUser: Employee;
  viewAs: Role;
  employees: Employee[];
  candidates: Candidate[];
  leaves: LeaveRequest[];
  theme: 'light' | 'dark';
}