import React, { useState, useEffect } from 'react';
import { Candidate, Job, Interview, CandidateStage } from '../types';
import { ATSService, AIService } from '../services';
import { Card, Badge, Button, SectionHeader, Modal, StatCard } from '../components';
import { 
  Plus, MoreHorizontal, Calendar, Star, FileText, Briefcase, 
  MapPin, Clock, Search, Filter, ChevronLeft, CheckCircle, XCircle, 
  User, Mail, Phone, BarChart2, MessageSquare, Paperclip
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ATSProps {
  candidates: Candidate[];
}

type Tab = 'JOBS' | 'PIPELINE' | 'INTERVIEWS' | 'ANALYTICS';

export const ATS: React.FC<ATSProps> = () => {
  const [activeTab, setActiveTab] = useState<Tab>('JOBS');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected State
  const [selectedJobId, setSelectedJobId] = useState<string | 'ALL'>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // Modals
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [j, c, i] = await Promise.all([
        ATSService.getJobs(),
        ATSService.getCandidates(),
        ATSService.getInterviews()
      ]);
      setJobs(j || []);
      setCandidates(c || []);
      setInterviews(i || []);
    } catch (error) {
      console.error("Failed to load ATS data", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCandidates = () => {
    if (selectedJobId === 'ALL') return candidates;
    return candidates.filter(c => c.jobId === selectedJobId);
  };

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData('candidateId', candidateId);
  };

  const handleDrop = async (e: React.DragEvent, stage: CandidateStage) => {
    const candidateId = e.dataTransfer.getData('candidateId');
    if (!candidateId) return;

    // Optimistic Update
    const updatedCandidates = candidates.map(c => 
      c.id === candidateId ? { ...c, stage } : c
    );
    setCandidates(updatedCandidates);

    // API Call
    await ATSService.updateCandidateStage(candidateId, stage);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // --- RENDER SUB-COMPONENTS ---

  const renderJobs = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
         <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search jobs..." className="pl-10 pr-4 py-2 border rounded-lg w-full" />
         </div>
         <Button variant="primary" onClick={() => setIsJobModalOpen(true)}>
            <Plus size={16} className="mr-2" /> Post New Job
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {jobs.map(job => (
          <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
             <div className="flex justify-between items-start mb-2">
               <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.department}</p>
               </div>
               <Badge color={job.status === 'Open' ? 'green' : 'gray'}>{job.status}</Badge>
             </div>
             
             <div className="flex flex-wrap gap-2 text-xs text-gray-500 my-4">
                <span className="flex items-center"><MapPin size={12} className="mr-1"/> {job.location}</span>
                <span className="flex items-center"><Briefcase size={12} className="mr-1"/> {job.type}</span>
                <span className="flex items-center"><Clock size={12} className="mr-1"/> {job.postedDate}</span>
             </div>

             <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-600">
                      {i}
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-600">
                    +12
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setSelectedJobId(job.id); setActiveTab('PIPELINE'); }}>
                   View Pipeline
                </Button>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPipeline = () => {
    const stages: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
    const filtered = getFilteredCandidates();

    return (
      <div className="h-full flex flex-col">
        {/* Pipeline Controls */}
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter by Job:</label>
              <select 
                value={selectedJobId} 
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="border border-gray-300 rounded-md text-sm p-1.5 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Jobs</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
           </div>
           <div className="flex space-x-2">
              <span className="text-sm text-gray-500 flex items-center"><Star size={14} className="mr-1 text-yellow-400 fill-yellow-400"/> AI Match Score Enabled</span>
           </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4 h-full">
            {stages.map(stage => {
              const stageCandidates = filtered.filter(c => c.stage === stage);
              return (
                <div 
                  key={stage} 
                  className="w-80 flex flex-col bg-gray-100/80 rounded-xl p-3 h-full min-h-[600px] border border-gray-200"
                  onDrop={(e) => handleDrop(e, stage)}
                  onDragOver={handleDragOver}
                >
                  <div className="flex justify-between items-center mb-4 px-2">
                    <h3 className="font-semibold text-gray-700 flex items-center">
                      {stage}
                      <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{stageCandidates.length}</span>
                    </h3>
                    <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
                  </div>
                  
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                    {stageCandidates.map(candidate => (
                      <Card 
                        key={candidate.id} 
                        className="p-4 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-blue-500 group"
                        draggable
                        onDragStart={(e) => handleDragStart(e, candidate.id as string)}
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{candidate.firstName} {candidate.lastName}</h4>
                          {candidate.aiMatchScore >= 80 && (
                            <Badge color="green">{candidate.aiMatchScore}% Match</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2 truncate">
                          {jobs.find(j => j.id === candidate.jobId)?.title}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {candidate.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="text-[10px] bg-white border px-1.5 py-0.5 rounded text-gray-600">{skill}</span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                           <div className="flex items-center">
                             <Briefcase size={12} className="mr-1"/> {candidate.experienceYears}y
                           </div>
                           <div className="flex">
                             {[...Array(candidate.rating)].map((_, i) => <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />)}
                           </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Time to Hire" value="18 Days" trend="-2 days vs avg" icon={Clock} color="blue" />
          <StatCard title="Offer Acceptance" value="85%" trend="+5% increase" icon={CheckCircle} color="green" />
          <StatCard title="Active Candidates" value={candidates.length.toString()} trend="Across 5 jobs" icon={User} color="purple" />
          <StatCard title="Cost per Hire" value="$1,200" trend="Within budget" icon={BarChart2} color="orange" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-96">
             <h3 className="text-lg font-bold mb-4">Pipeline Funnel</h3>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                 { stage: 'Applied', count: 120 },
                 { stage: 'Screening', count: 65 },
                 { stage: 'Interview', count: 24 },
                 { stage: 'Offer', count: 8 },
                 { stage: 'Hired', count: 5 }
               ]} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                 <XAxis type="number" hide />
                 <YAxis dataKey="stage" type="category" width={80} />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right' }} />
               </BarChart>
             </ResponsiveContainer>
          </Card>
          <Card className="h-96">
             <h3 className="text-lg font-bold mb-4">Source Effectiveness</h3>
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={[
                   { name: 'LinkedIn', value: 45 },
                   { name: 'Referral', value: 20 },
                   { name: 'Indeed', value: 25 },
                   { name: 'Career Page', value: 10 }
                 ]} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                   {
                     [0,1,2,3].map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={['#0077b5', '#10b981', '#2563eb', '#f59e0b'][index % 4]} />
                     ))
                   }
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
          </Card>
       </div>
    </div>
  );

  const renderInterviews = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-lg font-bold">Upcoming Interviews</h3>
         <Button variant="primary">Schedule Interview</Button>
      </div>
      
      <div className="space-y-3">
        {interviews.map(int => {
          const candidate = candidates.find(c => c.id === int.candidateId);
          const job = jobs.find(j => j.id === int.jobId);
          
          return (
            <Card key={int.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50">
               <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg text-center min-w-[60px]">
                     <span className="block text-xs font-bold uppercase">{new Date(int.startDateTime).toLocaleDateString('en-US', { month: 'short' })}</span>
                     <span className="block text-xl font-bold">{new Date(int.startDateTime).getDate()}</span>
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900">{candidate?.firstName} {candidate?.lastName} <span className="text-gray-400 font-normal">for</span> {job?.title}</h4>
                     <p className="text-sm text-gray-500 flex items-center mt-1">
                       <Clock size={14} className="mr-1"/> {new Date(int.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(int.endDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       <span className="mx-2">•</span>
                       {int.type}
                     </p>
                  </div>
               </div>
               <div className="mt-4 md:mt-0 flex items-center space-x-3">
                  <Button size="sm" variant="outline">Reschedule</Button>
                  <Button size="sm" variant="primary">Start Video</Button>
               </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // --- CANDIDATE PROFILE MODAL ---
  const renderCandidateModal = () => {
    if (!selectedCandidate) return null;
    const job = jobs.find(j => j.id === selectedCandidate.jobId);

    return (
      <Modal isOpen={!!selectedCandidate} onClose={() => setSelectedCandidate(null)} title="" size="5xl">
         <div className="flex flex-col h-[85vh]">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4 mb-4">
               <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500">
                    {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
                    <p className="text-base text-blue-600">{job?.title}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                       <span className="flex items-center"><Mail size={14} className="mr-2"/> {selectedCandidate.email}</span>
                       <span className="flex items-center"><Phone size={14} className="mr-2"/> {selectedCandidate.phone}</span>
                       <span className="flex items-center"><MapPin size={14} className="mr-2"/> Remote</span>
                    </div>
                  </div>
               </div>
               <div className="flex flex-col items-end space-y-3">
                  <Badge color="blue">{selectedCandidate.stage}</Badge>
                  <div className="flex text-yellow-400 text-base">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} className={i < selectedCandidate.rating ? "fill-current" : "text-gray-300"} />)}
                  </div>
               </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 grid grid-cols-12 gap-8 overflow-y-auto pr-2 custom-scrollbar">
               {/* Left: Info */}
               <div className="col-span-8 space-y-8">
                  {/* AI Insights */}
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                     <div className="flex items-center justify-between mb-4">
                       <h4 className="font-bold text-purple-900 flex items-center text-lg"><Star size={20} className="mr-2"/> AI Match Analysis</h4>
                       <span className="text-2xl font-bold text-purple-700">{selectedCandidate.aiMatchScore}%</span>
                     </div>
                     <p className="text-base text-purple-800 mb-4 leading-relaxed">Strong match for <strong>React</strong> and <strong>Node.js</strong> requirements. Experience level aligns with Senior role. Candidate demonstrates leadership potential based on past roles.</p>
                     <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map(skill => (
                           <span key={skill} className="px-3 py-1 bg-white bg-opacity-60 text-purple-900 text-sm rounded-full border border-purple-200">{skill}</span>
                        ))}
                     </div>
                  </div>

                  {/* Resume / Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Experience & Resume</h3>
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 text-center">
                       <FileText size={48} className="mx-auto text-gray-400 mb-3"/>
                       <p className="text-lg text-gray-600 font-medium">Resume_JohnDoe.pdf</p>
                       <p className="text-sm text-gray-400 mb-4">Uploaded on Oct 1, 2023</p>
                       <Button size="md" variant="outline">Preview Document</Button>
                    </div>
                  </div>

                  {/* Notes Stream */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Team Notes</h3>
                    <div className="space-y-4">
                       <div className="flex space-x-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">MJ</div>
                          <div className="bg-gray-50 p-4 rounded-2xl flex-1 text-gray-700">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-900">Marcus Johnson</span>
                                <span className="text-xs text-gray-400">2 days ago</span>
                             </div>
                             <p>Impressive portfolio. I'd like to schedule a technical round ASAP. Particularly liked the open source contributions.</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                       <input type="text" placeholder="Add a note..." className="flex-1 border rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                       <Button size="sm" variant="secondary">Post</Button>
                    </div>
                  </div>
               </div>

               {/* Right: Actions */}
               <div className="col-span-4 space-y-6">
                  <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
                     <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-2">Actions</h4>
                     <Button className="w-full justify-start h-12" variant="outline"><Calendar size={18} className="mr-3"/> Schedule Interview</Button>
                     <Button className="w-full justify-start h-12" variant="outline"><Mail size={18} className="mr-3"/> Email Candidate</Button>
                     <Button className="w-full justify-start h-12" variant="outline"><CheckCircle size={18} className="mr-3"/> Send Assessment</Button>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
                     <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-2">Pipeline Stage</h4>
                     <div className="space-y-2">
                        {['Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map(stage => (
                           <button 
                             key={stage}
                             onClick={() => {
                               setCandidates(candidates.map(c => c.id === selectedCandidate.id ? {...c, stage: stage as CandidateStage} : c));
                               setSelectedCandidate({...selectedCandidate, stage: stage as CandidateStage});
                             }}
                             className={`w-full text-left px-4 py-3 rounded-xl text-sm flex justify-between items-center transition-all ${selectedCandidate.stage === stage ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'hover:bg-gray-50 text-gray-600 border border-transparent'}`}
                           >
                             {stage}
                             {selectedCandidate.stage === stage && <CheckCircle size={16}/>}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  {selectedCandidate.stage === 'Offer' && (
                     <Button variant="primary" className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg">Convert to Employee</Button>
                  )}
                  {selectedCandidate.stage === 'Hired' && (
                     <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center text-sm font-bold border border-green-200">
                       Hired on {new Date().toLocaleDateString()}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </Modal>
    );
  }

  // --- JOB MODAL ---
  const renderJobModal = () => (
    <Modal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} title="Create Job Requisition" size="2xl">
      <form className="space-y-6">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input type="text" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Senior Product Manager" />
         </div>
         <div className="grid grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
               <select className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                 <option>Engineering</option>
                 <option>Product</option>
                 <option>Sales</option>
                 <option>Marketing</option>
                 <option>HR</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
               <input type="text" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Remote / New York" />
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="w-full border p-3 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Job description..."></textarea>
            <button type="button" className="text-sm text-blue-600 mt-2 flex items-center font-medium hover:text-blue-800"><Star size={14} className="mr-1"/> Generate with AI</button>
         </div>
         <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsJobModalOpen(false)}>Cancel</Button>
            <Button variant="primary">Create Requisition</Button>
         </div>
      </form>
    </Modal>
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading ATS...</div>;

  return (
    <div className="flex flex-col h-full">
      <SectionHeader 
        title="Recruitment (ATS)" 
        description="End-to-end hiring management."
        action={
          <div className="flex bg-white rounded-lg p-1 border shadow-sm">
             {(['JOBS', 'PIPELINE', 'INTERVIEWS', 'ANALYTICS'] as Tab[]).map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
               >
                 {tab.charAt(0) + tab.slice(1).toLowerCase()}
               </button>
             ))}
          </div>
        }
      />

      <div className="flex-1 overflow-hidden">
         {activeTab === 'JOBS' && renderJobs()}
         {activeTab === 'PIPELINE' && renderPipeline()}
         {activeTab === 'INTERVIEWS' && renderInterviews()}
         {activeTab === 'ANALYTICS' && renderAnalytics()}
      </div>

      {renderCandidateModal()}
      {renderJobModal()}
    </div>
  );
};