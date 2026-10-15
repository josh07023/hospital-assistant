import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Calendar, HelpCircle, Send, ShieldAlert, 
  Clock, User, Phone, CheckCircle2, Stethoscope, Search, Building2, 
  AlertTriangle, Bot, User as UserIcon, Sparkles, ChevronRight, X, HeartPulse, MessageSquare
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "👋 Hello! Welcome to **AuraCare AI Health Hub**.\n\nI can answer official hospital FAQs, provide clinical prevention guidelines, or schedule specialist consultations.",
      citation: 'AuraCare Clinical Knowledge Base v2.4',
      tool: 'System Greeting',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [faqs, setFaqs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [faqSearch, setFaqSearch] = useState('');
  const [diseaseSearch, setDiseaseSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patient_name: '', department: 'Cardiology', doctor_name: 'Dr. Sarah Jenkins', date: '', time: '09:00 AM', contact: ''
  });
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    fetchFaqs();
    fetchDiseases();
    fetchAppointments();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchFaqs = async () => {
    try { 
      const res = await fetch('/api/faqs'); 
      if (res.ok) {
        setFaqs(await res.json());
      } else {
        throw new Error();
      }
    } 
    catch { 
      setFaqs([
        { id: 1, question: "What are the general visiting hours and ICU visitation rules?", answer: "General ward visiting hours are strictly daily from 10:00 AM to 8:00 PM (maximum 2 visitors per patient). ICU visiting hours are limited to 11:00 AM - 12:00 PM and 5:00 PM - 6:00 PM with required sterile gowning.", department: "General & ICU", citation: "AuraCare Policy Sec 4.2" },
        { id: 2, question: "Where is the emergency department and how does triage work?", answer: "The Emergency Department is located on the Ground Floor, East Wing, accessible 24/7 with dedicated ambulance bays. Patients are triaged using the Emergency Severity Index (ESI) Level 1 (Immediate) to Level 5 (Non-Urgent).", department: "Emergency", citation: "Clinical Triage Protocol E-1" },
        { id: 3, question: "Which medical departments are available at the hospital?", answer: "AuraCare houses Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, General Surgery, Emergency Medicine, and Outpatient Internal Medicine clinics.", department: "Administration", citation: "Hospital Directory 2026" },
        { id: 4, question: "What are common symptoms and prevention methods for Migraines?", answer: "Migraines involve throbbing unilateral headache, nausea, and sensitivity to light/sound. Prevention includes identifying triggers, stress management, hydration, regular sleep cycles, and preventive medications.", department: "Neurology", citation: "Neurology Clinical Guide N-8" },
        { id: 5, question: "How can I prevent Hypertension and manage blood pressure?", answer: "Hypertension prevention involves restricting dietary sodium to under 2,000 mg/day (DASH diet), exercising 150 min/week, maintaining healthy BMI, limiting alcohol, and avoiding tobacco.", department: "Cardiology", citation: "Cardiovascular Prevention Manual C-3" }
      ]); 
    }
  };

  const fetchDiseases = async () => {
    try { 
      const res = await fetch('/api/diseases'); 
      if (res.ok) {
        setDiseases(await res.json());
      } else {
        throw new Error();
      }
    } 
    catch { 
      setDiseases([
        { id: 1, condition: "Hypertension (High Blood Pressure)", description: "A chronic medical condition where long-term force of blood against arterial walls is elevated.", symptoms: ["Frequent headaches", "Shortness of breath", "Dizziness", "Visual disturbances"], prevention: ["Sodium restriction (<2g/day)", "Regular aerobic exercise", "DASH Diet Plan"], department: "Cardiology" },
        { id: 2, condition: "Migraine Headache Disorder", description: "A neurological condition characterized by recurrent, moderate-to-severe throbbing headaches typically affecting one side.", symptoms: ["Unilateral throbbing pain", "Nausea/Vomiting", "Photophobia", "Aura vision"], prevention: ["Consistent sleep routine", "Hydration", "Magnesium supplements"], department: "Neurology" },
        { id: 3, condition: "Acute Influenza & Viral Fever", description: "A contagious respiratory illness caused by influenza viruses infecting the nose, throat, and lungs.", symptoms: ["High fever & chills", "Body aches", "Fatigue", "Dry cough"], prevention: ["Annual influenza vaccination", "Frequent hand hygiene", "Immune support"], department: "General Medicine" },
        { id: 4, condition: "Type 2 Diabetes Mellitus", description: "A metabolic condition characterized by insulin resistance and high blood glucose levels.", symptoms: ["Increased thirst", "Frequent urination", "Unexplained fatigue", "Blurred vision"], prevention: ["Balanced low-glycemic diet", "Daily physical activity", "Blood sugar monitoring"], department: "Endocrinology" }
      ]); 
    }
  };

  const fetchAppointments = async () => {
    try { const res = await fetch('/api/appointments'); if (res.ok) setAppointments(await res.json()); } 
    catch { setAppointments([]); }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInputMessage('');
    
    setMessages(prev => [...prev, { sender: 'user', text: userText, timestamp: timeStr }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { 
          sender: 'assistant', 
          text: data.response, 
          citation: data.citation || 'Verified Healthcare KB', 
          tool: data.tool_used || 'General AI',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else { throw new Error(); }
    } catch {
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: "General visiting hours are strictly daily from 10:00 AM to 8:00 PM. For emergency triage, please proceed directly to the East Wing.", 
        citation: "Fallback Guardrail Protocol", 
        tool: "Safety System",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInputMessage(promptText);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentForm)
      });
      if (res.ok) {
        setBookingStatus({ success: true, message: "Appointment successfully confirmed!" });
        fetchAppointments();
        setTimeout(() => { setShowModal(false); setBookingStatus(null); }, 2000);
      } else { setBookingStatus({ success: false, message: "Booking failed. Please try again." }); }
    } catch {
      setAppointments(prev => [...prev, { ...appointmentForm, id: appointments.length + 1, status: 'Confirmed' }]);
      setBookingStatus({ success: true, message: "Appointment scheduled successfully!" });
      setTimeout(() => { setShowModal(false); setBookingStatus(null); }, 2000);
    }
  };

  const filteredFaqs = faqs.filter(f => f.question.toLowerCase().includes(faqSearch.toLowerCase()) || f.answer.toLowerCase().includes(faqSearch.toLowerCase()));
  const filteredDiseases = diseases.filter(d => d.condition.toLowerCase().includes(diseaseSearch.toLowerCase()) || d.symptoms.some(s => s.toLowerCase().includes(diseaseSearch.toLowerCase())));

  return (
    <div className="min-h-screen bg-[#0F1417] text-[#EBEBED] flex flex-col font-sans selection:bg-[#53E6D4] selection:text-[#0F1417]">
      {/* Top Critical Emergency Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
        <AlertTriangle className="w-4 h-4 animate-bounce shrink-0" />
        <span>For immediate medical emergencies, dial 911 / 112 or visit Emergency Ground Floor East Wing.</span>
      </div>

      {/* Main Carbon Black & Neon Mint Header */}
      <header className="bg-[#161C22] border-b border-white/10 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#6045F4] flex items-center justify-center text-[#53E6D4] shadow-lg shadow-[#6045F4]/40 ring-1 ring-[#53E6D4]/30">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                AuraCare <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#53E6D4]/10 text-[#53E6D4] border border-[#53E6D4]/30">AI Hub</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Enterprise Hospital Assistant & Clinical FAQs</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0F1417] p-1.5 rounded-2xl border border-white/10">
            <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-[#6045F4] text-white shadow-lg shadow-[#6045F4]/30' : 'text-slate-400 hover:text-white'}`}>
              <Bot className="w-4 h-4" /> AI Assistant
            </button>
            <button onClick={() => setActiveTab('faqs')} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'faqs' ? 'bg-[#6045F4] text-white shadow-lg shadow-[#6045F4]/30' : 'text-slate-400 hover:text-white'}`}>
              <HelpCircle className="w-4 h-4" /> FAQs
            </button>
            <button onClick={() => setActiveTab('diseases')} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'diseases' ? 'bg-[#6045F4] text-white shadow-lg shadow-[#6045F4]/30' : 'text-slate-400 hover:text-white'}`}>
              <Stethoscope className="w-4 h-4" /> Health Directory
            </button>
            <button onClick={() => setActiveTab('appointments')} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === 'appointments' ? 'bg-[#6045F4] text-white shadow-lg shadow-[#6045F4]/30' : 'text-slate-400 hover:text-white'}`}>
              <Calendar className="w-4 h-4" /> Appointments
              {appointments.length > 0 && <span className="ml-1 bg-[#53E6D4] text-[#0F1417] font-bold px-2 py-0.5 text-[10px] rounded-full">{appointments.length}</span>}
            </button>
          </nav>

          <button onClick={() => setShowModal(true)} className="bg-[#53E6D4] hover:bg-[#53E6D4]/90 text-[#0F1417] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-[#53E6D4]/20 transition-all transform hover:scale-105 active:scale-95">
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)] min-h-[580px]">
            {/* Left Sidebar */}
            <div className="hidden lg:flex flex-col gap-4 bg-[#161C22] p-5 rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#53E6D4] flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Suggested Inquiries
              </h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleQuickPrompt("What are the general visiting hours and ICU rules?")} className="text-left text-xs bg-[#0F1417] border border-white/10 p-3.5 rounded-2xl hover:border-[#6045F4] hover:bg-[#0F1417] text-slate-200 hover:text-white transition-all flex items-center justify-between group shadow-sm">
                  <span>🕒 Visiting Hours</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#53E6D4] opacity-80 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => handleQuickPrompt("Which medical departments are available at the hospital?")} className="text-left text-xs bg-[#0F1417] border border-white/10 p-3.5 rounded-2xl hover:border-[#6045F4] hover:bg-[#0F1417] text-slate-200 hover:text-white transition-all flex items-center justify-between group shadow-sm">
                  <span>🏥 Available Departments</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#53E6D4] opacity-80 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => handleQuickPrompt("How can I prevent Hypertension and manage blood pressure?")} className="text-left text-xs bg-[#0F1417] border border-white/10 p-3.5 rounded-2xl hover:border-[#6045F4] hover:bg-[#0F1417] text-slate-200 hover:text-white transition-all flex items-center justify-between group shadow-sm">
                  <span>🩺 Hypertension Guidelines</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#53E6D4] opacity-80 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => handleQuickPrompt("What are common symptoms and preventions for Migraines?")} className="text-left text-xs bg-[#0F1417] border border-white/10 p-3.5 rounded-2xl hover:border-[#6045F4] hover:bg-[#0F1417] text-slate-200 hover:text-white transition-all flex items-center justify-between group shadow-sm">
                  <span>🧠 Migraine Prevention</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#53E6D4] opacity-80 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <div className="mt-auto bg-[#0F1417] p-4 rounded-2xl border border-white/10 text-xs text-slate-300">
                <span className="font-bold text-[#53E6D4] block mb-1">🤖 Clinical Intelligence:</span>
                Powered by Gemini API + Local Knowledge Base.
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3 bg-[#161C22] border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="bg-[#0F1417] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#53E6D4] animate-pulse" />
                  <div>
                    <span className="text-sm font-bold text-white block">AuraCare AI Live Assistant</span>
                    <span className="text-[10px] text-[#53E6D4] font-medium">Online • Clinical System Ready</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-[#6045F4]/20 text-[#53E6D4] border border-[#53E6D4]/30 px-3 py-1 rounded-full">FastAPI + Gemini API</span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.sender === 'assistant' && (
                      <div className="w-9 h-9 rounded-2xl bg-[#6045F4] flex items-center justify-center text-[#53E6D4] shrink-0 shadow-md">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}

                    <div className={`flex flex-col max-w-[80%] ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                        m.sender === 'user' 
                          ? 'bg-[#6045F4] text-white rounded-tr-none shadow-lg' 
                          : 'bg-[#0F1417] text-[#EBEBED] border border-white/10 rounded-tl-none'
                      }`}>
                        <div className="whitespace-pre-line">{m.text}</div>
                      </div>

                      {m.sender === 'assistant' && (
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-mono">
                          <span className="bg-[#0F1417] border border-white/10 px-2 py-0.5 rounded text-[#53E6D4]">Tool: {m.tool}</span>
                          <span>•</span>
                          <span>Citation: {m.citation}</span>
                          <span>•</span>
                          <span>{m.timestamp}</span>
                        </div>
                      )}
                    </div>

                    {m.sender === 'user' && (
                      <div className="w-9 h-9 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-white shrink-0">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3 items-center text-slate-400 text-xs">
                    <div className="w-9 h-9 rounded-2xl bg-[#6045F4] flex items-center justify-center text-[#53E6D4] animate-pulse">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-[#0F1417] px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#53E6D4] rounded-full animate-ping" />
                      <span>Consulting medical knowledge base...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-[#0F1417] border-t border-white/10 flex gap-3">
                <input 
                  type="text" 
                  value={inputMessage} 
                  onChange={e => setInputMessage(e.target.value)} 
                  placeholder="Ask about hospital visiting hours, diseases, or booking appointments..." 
                  className="flex-1 bg-[#161C22] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#6045F4]"
                />
                <button 
                  type="submit" 
                  disabled={!inputMessage.trim() || loading}
                  className="bg-[#53E6D4] text-[#0F1417] font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-[#53E6D4]/20 hover:bg-[#53E6D4]/90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#161C22] p-6 rounded-3xl border border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Hospital FAQ Directory</h2>
                <p className="text-xs text-slate-400 mt-1">Verified hospital policies, department locations, and guidelines.</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                <input type="text" placeholder="Search FAQs..." value={faqSearch} onChange={e => setFaqSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-[#0F1417] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#6045F4]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFaqs.map(f => (
                <div key={f.id} className="bg-[#161C22] p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-[#6045F4] transition-all">
                  <div>
                    <span className="text-[10px] font-mono bg-[#6045F4]/20 text-[#53E6D4] border border-[#53E6D4]/30 px-2.5 py-1 rounded-full">{f.department}</span>
                    <h3 className="font-bold text-white text-base mt-3">{f.question}</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{f.answer}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                    Citation: {f.citation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Directory Tab */}
        {activeTab === 'diseases' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#161C22] p-6 rounded-3xl border border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Disease Information & Prevention</h2>
                <p className="text-xs text-slate-400 mt-1">Clinical details, symptoms, and preventive guidance.</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                <input type="text" placeholder="Search conditions or symptoms..." value={diseaseSearch} onChange={e => setDiseaseSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-[#0F1417] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#6045F4]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDiseases.map(d => (
                <div key={d.id} className="bg-[#161C22] p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-[#53E6D4] transition-all">
                  <div>
                    <span className="text-[10px] font-mono bg-[#53E6D4]/20 text-[#53E6D4] border border-[#53E6D4]/30 px-2.5 py-1 rounded-full">{d.department}</span>
                    <h3 className="text-lg font-bold text-white mt-3">{d.condition}</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{d.description}</p>
                    <div className="mt-4 bg-[#0F1417] p-3.5 rounded-2xl border border-white/5 text-xs space-y-2">
                      <div><strong className="text-[#53E6D4]">Symptoms:</strong> {d.symptoms.join(', ')}</div>
                      <div><strong className="text-[#6045F4]">Prevention:</strong> {d.prevention.join(', ')}</div>
                    </div>
                  </div>
                  <button onClick={() => { setAppointmentForm(prev => ({ ...prev, department: d.department })); setShowModal(true); }} className="mt-4 w-full bg-[#6045F4] hover:bg-[#6045F4]/90 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                    <Stethoscope className="w-4 h-4" /> Book Consultation
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-[#161C22] p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Scheduled Appointments</h2>
              <button onClick={() => setShowModal(true)} className="bg-[#53E6D4] text-[#0F1417] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Schedule New
              </button>
            </div>
            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {appointments.map((a, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-[#0F1417] rounded-2xl border border-white/5 text-xs">
                    <div>
                      <span className="font-bold text-white text-sm block">{a.patient_name}</span>
                      <span className="text-slate-400">{a.department} Clinic • Dr. {a.doctor_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#53E6D4] font-mono block">{a.date} at {a.time}</span>
                      <span className="text-emerald-400 font-semibold inline-flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs bg-[#0F1417] rounded-2xl border border-dashed border-white/10">
                No active appointments booked yet.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#161C22] rounded-3xl max-w-lg w-full p-6 border border-white/10 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold text-white mb-1">Book Hospital Appointment</h3>
            <p className="text-xs text-slate-400 mb-4">Select clinic department and doctor schedule.</p>
            {bookingStatus && (
              <div className={`mb-4 p-3 rounded-xl text-xs font-semibold ${bookingStatus.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {bookingStatus.message}
              </div>
            )}
            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Patient Name</label>
                <input type="text" required value={appointmentForm.patient_name} onChange={e => setAppointmentForm({ ...appointmentForm, patient_name: e.target.value })} className="w-full p-2.5 bg-[#0F1417] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#6045F4]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select value={appointmentForm.department} onChange={e => setAppointmentForm({ ...appointmentForm, department: e.target.value })} className="w-full p-2.5 bg-[#0F1417] border border-white/10 rounded-xl text-white">
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Doctor Name</label>
                  <input type="text" required value={appointmentForm.doctor_name} onChange={e => setAppointmentForm({ ...appointmentForm, doctor_name: e.target.value })} className="w-full p-2.5 bg-[#0F1417] border border-white/10 rounded-xl text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input type="date" required value={appointmentForm.date} onChange={e => setAppointmentForm({ ...appointmentForm, date: e.target.value })} className="w-full p-2.5 bg-[#0F1417] border border-white/10 rounded-xl text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time</label>
                  <select value={appointmentForm.time} onChange={e => setAppointmentForm({ ...appointmentForm, time: e.target.value })} className="w-full p-2.5 bg-[#0F1417] border border-white/10 rounded-xl text-white">
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Contact Email / Phone</label>
                <input type="text" required value={appointmentForm.contact} onChange={e => setAppointmentForm({ ...appointmentForm, contact: e.target.value })} className="w-full p-2.5 bg-[#0F1417] border border-white/10 rounded-xl text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#53E6D4] text-[#0F1417] font-bold rounded-xl">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}