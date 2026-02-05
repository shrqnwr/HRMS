import { Employee, Candidate, Job, Interview, LeaveRequest, PayrollRecord, PerformanceReview, PerformanceGoal, OnboardingTask, BenefitPlan, EmployeeBenefit } from './types';

// --- JOBS ---
export const MOCK_JOBS: Job[] = [
  {
    id: 'JOB001',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    status: 'Open',
    hiringManagerId: 'EMP002',
    postedDate: '2023-10-01',
    description: 'We are looking for a React expert...',
    requirements: ['React', 'TypeScript', 'Tailwind', '5+ Years Exp']
  },
  {
    id: 'JOB002',
    title: 'Product Designer',
    department: 'Product',
    location: 'San Francisco',
    type: 'Full-time',
    status: 'Open',
    hiringManagerId: 'EMP002',
    postedDate: '2023-10-05'
  },
  {
    id: 'JOB003',
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'London',
    type: 'Contract',
    status: 'Closed',
    hiringManagerId: 'EMP001',
    postedDate: '2023-09-15'
  }
];

// --- CANDIDATES ---
export const MOCK_CANDIDATES: Candidate[] = [
  { 
    id: 'CAN001', 
    jobId: 'JOB001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 555-0199',
    source: 'LinkedIn',
    skills: ['React', 'Node.js', 'AWS'],
    experienceYears: 6,
    stage: 'Interview', 
    rating: 4, 
    aiMatchScore: 88,
    appliedDate: '2023-10-01',
    tags: ['Top Choice', 'Available Immediately']
  },
  { 
    id: 'CAN002', 
    jobId: 'JOB002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+1 555-0299',
    source: 'Referral',
    skills: ['Figma', 'Sketch', 'UI/UX'],
    experienceYears: 4,
    stage: 'Screening', 
    rating: 3, 
    aiMatchScore: 72,
    appliedDate: '2023-10-05',
    tags: ['Portfolio Pending']
  },
  { 
    id: 'CAN003', 
    jobId: 'JOB001',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert@example.com',
    phone: '+1 555-0399',
    source: 'Indeed',
    skills: ['Angular', 'Java'],
    experienceYears: 8,
    stage: 'Offer', 
    rating: 5, 
    aiMatchScore: 65,
    appliedDate: '2023-09-28' 
  },
  { 
    id: 'CAN004', 
    jobId: 'JOB001',
    firstName: 'Alice',
    lastName: 'Wonder',
    email: 'alice@example.com',
    phone: '+1 555-0499',
    source: 'Career Page',
    skills: ['React', 'Vue', 'CSS'],
    experienceYears: 3,
    stage: 'Applied', 
    rating: 0, 
    aiMatchScore: 92,
    appliedDate: '2023-10-10' 
  },
];

// --- INTERVIEWS ---
export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: 'INT001',
    candidateId: 'CAN001',
    jobId: 'JOB001',
    type: 'Video',
    startDateTime: '2023-10-25T10:00:00',
    endDateTime: '2023-10-25T11:00:00',
    interviewerId: 'EMP002',
    status: 'Scheduled',
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'INT002',
    candidateId: 'CAN002',
    jobId: 'JOB002',
    type: 'Phone',
    startDateTime: '2023-10-26T14:00:00',
    endDateTime: '2023-10-26T14:30:00',
    interviewerId: 'EMP003',
    status: 'Scheduled'
  }
];

// --- EMPLOYEES (Existing) ---
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    firstName: 'Alexandra',
    lastName: 'Chen',
    email: 'alex.chen@nexus.co',
    phoneNumber: '+1-555-0101',
    gender: 'Female',
    dateOfBirth: '1985-05-12',
    age: 38,
    avatar: 'https://picsum.photos/id/64/200/200',
    role: 'ADMIN',
    
    // Employment
    joiningDate: '2020-03-15',
    status: 'Active',
    employmentType: 'Regular',
    probationEndDate: '2020-09-15',
    confirmationStatus: 'Confirmed',
    noticePeriod: 90,
    location: 'New York, US',
    workSubLocation: 'NY-HQ-Floor3',
    
    // Job
    designation: 'HR Director',
    position: 'HR Director', // Legacy fallback
    division: 'Corporate Services',
    department: 'Human Resources',
    grade: 'L1',
    payGrade: 'Grade 12',
    jobLevel: 'Director',
    jobFamily: 'Human Resources',
    jobFunction: 'HR Operations',
    costCentreCode: 'CC-HR-01',
    costCentreName: 'HR Operations',
    legalEntity: 'Nexus Inc.',
    companyCode: 'NEX-US',
    managerName: 'CEO',

    // Compensation
    baseSalary: 120000,
    salaryFrequency: 'Annual',
    ctc: 150000,
    salaryRangeMin: 100000,
    salaryRangeMid: 130000,
    salaryRangeMax: 160000,
    currency: 'USD',

    // Work Conditions
    weeklyHours: 40,
    holidayCalendar: 'US-NY-Standard',
    highRiskRole: false,
    contractType: 'Full-time',

    // Tracking & Meta
    lastModifiedDate: '2023-10-01',
    recordStatus: 'Active'
  },
  {
    id: 'EMP002',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@nexus.co',
    phoneNumber: '+1-555-0202',
    gender: 'Male',
    dateOfBirth: '1989-08-20',
    age: 34,
    avatar: 'https://picsum.photos/id/91/200/200',
    role: 'MANAGER',

    joiningDate: '2021-06-01',
    status: 'Active',
    employmentType: 'Regular',
    noticePeriod: 60,
    location: 'San Francisco, US',
    workSubLocation: 'SF-TechHub',

    designation: 'Senior Engineering Manager',
    position: 'Engineering Manager',
    division: 'Product Development',
    department: 'Engineering',
    grade: 'L3',
    jobLevel: 'Senior Manager',
    jobFamily: 'Software Engineering',
    managerId: 'EMP001',
    managerName: 'Alexandra Chen',
    managerEmail: 'alex.chen@nexus.co',

    baseSalary: 145000,
    salaryFrequency: 'Annual',
    ctc: 180000,
    
    weeklyHours: 40,
    contractType: 'Full-time',
    
    lastConversationDate: '2023-06-20',
    conversationType: 'Mid-Year Review',
    managerConfirmationStatus: 'Yes'
  },
  {
    id: 'EMP003',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.w@nexus.co',
    gender: 'Female',
    dateOfBirth: '1995-02-10',
    age: 28,
    avatar: 'https://picsum.photos/id/129/200/200',
    role: 'EMPLOYEE',

    joiningDate: '2022-01-10',
    status: 'Active',
    employmentType: 'Regular',
    noticePeriod: 30,
    location: 'Remote',

    designation: 'Senior Frontend Developer',
    position: 'Senior Frontend Dev',
    division: 'Product Development',
    department: 'Engineering',
    grade: 'L4',
    jobLevel: 'Senior Associate',
    jobFamily: 'Software Engineering',
    managerId: 'EMP002',
    managerName: 'Marcus Johnson',

    baseSalary: 115000,
    salaryFrequency: 'Annual',
    ctc: 135000,
    
    weeklyHours: 40,
    contractType: 'Full-time'
  },
  {
    id: 'EMP004',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.k@nexus.co',
    gender: 'Male',
    dateOfBirth: '1992-11-05',
    age: 31,
    avatar: 'https://picsum.photos/id/218/200/200',
    role: 'EMPLOYEE',

    joiningDate: '2021-11-20',
    status: 'Inactive', // On Leave
    employmentType: 'Regular',
    location: 'Chicago, US',

    designation: 'Account Executive',
    position: 'Account Executive',
    division: 'North America Sales',
    department: 'Sales',
    managerName: 'Director of Sales',

    baseSalary: 95000,
    salaryFrequency: 'Annual',
    ctc: 140000,
    
    highRiskRole: true,
    weeklyHours: 40,
    contractType: 'Full-time'
  },
  {
    id: 'EMP005',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.d@nexus.co',
    gender: 'Female',
    dateOfBirth: '1999-04-15',
    age: 24,
    avatar: 'https://picsum.photos/id/338/200/200',
    role: 'EMPLOYEE',

    joiningDate: '2023-04-05',
    status: 'Active',
    employmentType: 'Regular',
    probationEndDate: '2023-10-05',
    confirmationStatus: 'Pending',
    location: 'London, UK',

    designation: 'Content Specialist',
    position: 'Content Specialist',
    division: 'Growth',
    department: 'Marketing',
    managerName: 'CMO',

    baseSalary: 75000,
    salaryFrequency: 'Annual',
    ctc: 85000,

    weeklyHours: 37.5,
    contractType: 'Full-time'
  }
];

// --- OTHER MOCKS ---
export const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'LR001', employeeId: 'EMP003', type: 'PTO', startDate: '2023-11-20', endDate: '2023-11-25', status: 'Approved', reason: 'Thanksgiving break' },
  { id: 'LR002', employeeId: 'EMP004', type: 'Sick', startDate: '2023-10-15', endDate: '2023-10-16', status: 'Approved', reason: 'Flu' },
  { id: 'LR003', employeeId: 'EMP005', type: 'PTO', startDate: '2023-12-20', endDate: '2024-01-05', status: 'Pending', reason: 'Winter holidays' },
];

export const MOCK_PAYROLL: PayrollRecord[] = [
  { id: 'PR001', employeeId: 'EMP003', period: 'Oct 2023', grossPay: 9583, taxes: 2300, benefits: 500, netPay: 6783, status: 'Processed', paymentDate: '2023-10-31' },
  { id: 'PR002', employeeId: 'EMP002', period: 'Oct 2023', grossPay: 12083, taxes: 3100, benefits: 600, netPay: 8383, status: 'Processed', paymentDate: '2023-10-31' },
  { id: 'PR003', employeeId: 'EMP003', period: 'Nov 2023', grossPay: 9583, taxes: 2300, benefits: 500, netPay: 6783, status: 'Pending' },
];

export const MOCK_REVIEWS: PerformanceReview[] = [
  { id: 'REV001', employeeId: 'EMP003', reviewerId: 'EMP002', cycle: 'Q3 2023', rating: 4.5, comments: 'Excellent delivery speed.', status: 'Completed' },
];

export const MOCK_GOALS: PerformanceGoal[] = [
  { id: 'G001', employeeId: 'EMP003', title: 'Reduce Load Time', description: 'Improve main dashboard load time by 20%', status: 'In Progress', progress: 60, dueDate: '2023-12-31' },
  { id: 'G002', employeeId: 'EMP003', title: 'Learn GraphQL', description: 'Complete advanced GraphQL certification', status: 'Completed', progress: 100, dueDate: '2023-10-30' },
  { id: 'G003', employeeId: 'EMP002', title: 'Hire 3 Engineers', description: 'Scale the backend team', status: 'In Progress', progress: 33, dueDate: '2024-01-31' },
];

export const MOCK_ONBOARDING: OnboardingTask[] = [
  { id: 'T001', employeeId: 'EMP005', title: 'Sign Offer Letter', status: 'Completed', dueDate: '2023-04-01' },
  { id: 'T002', employeeId: 'EMP005', title: 'IT Setup (Laptop)', status: 'Completed', dueDate: '2023-04-04', assigneeId: 'EMP002' },
  { id: 'T003', employeeId: 'EMP005', title: 'Compliance Training', status: 'Pending', dueDate: '2023-04-10' },
];

export const MOCK_PLANS: BenefitPlan[] = [
  { id: 'BP001', name: 'Gold Health PPO', type: 'Health', provider: 'BlueCross', costToEmployee: 150, coverageDetails: '$20 copay, $500 deductible' },
  { id: 'BP002', name: 'Silver Health HMO', type: 'Health', provider: 'Kaiser', costToEmployee: 80, coverageDetails: '$40 copay, $1000 deductible' },
  { id: 'BP003', name: 'Delta Dental', type: 'Dental', provider: 'Delta', costToEmployee: 20, coverageDetails: 'Includes orthodontics' },
  { id: 'BP004', name: 'VSP Vision', type: 'Vision', provider: 'VSP', costToEmployee: 10, coverageDetails: 'Annual frames and lenses' },
];

export const MOCK_EMPLOYEE_BENEFITS: EmployeeBenefit[] = [
  { id: 'EB001', employeeId: 'EMP003', planId: 'BP001', status: 'Active', enrollmentDate: '2022-02-01' },
  { id: 'EB002', employeeId: 'EMP003', planId: 'BP003', status: 'Active', enrollmentDate: '2022-02-01' },
];

export const MOCK_TIMESHEETS = [
  { date: 'Mon, Oct 23', in: '09:00:00 AM', out: '05:30:00 PM', proj: 'Nexus HRMS Development', total: '08:30:00', status: 'Approved' },
  { date: 'Tue, Oct 24', in: '09:15:00 AM', out: '06:00:00 PM', proj: 'Nexus HRMS Development', total: '08:45:00', status: 'Approved' },
  { date: 'Wed, Oct 25', in: '09:00:00 AM', out: '05:00:00 PM', proj: 'Internal Meeting', total: '08:00:00', status: 'Pending' },
];