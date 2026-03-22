/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Scale, 
  Shield, 
  Car, 
  User, 
  Truck, 
  Bike, 
  AlertTriangle, 
  Gavel, 
  FileText, 
  MessageSquare, 
  ChevronRight, 
  Star, 
  Menu, 
  X, 
  Play,
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const PHONE_NUMBER = "954-641-9100";
const EMAIL = "phillipmenditto@phillipmenditto.com";
const CALENDLY_URL = "https://calendly.com/phillipmenditto"; // Placeholder for actual link

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const BROWARD_RESOURCES = `
LEGAL AID & REFERRALS:
- Broward Legal Aid: 954-765-8950 (Civil advice, housing)
- Coast to Coast Legal Aid: 954-736-2400 (Low-income civil services)
- Broward Clerk Self-Help: 954-831-7019 (Forms/filing help)
- Florida Senior/Vets Helpline: 888-895-7873
- Bail Bonds Referrals: 954-831-5848 (Official info)

CRISIS & VICTIM SUPPORT:
- 211 Broward: Dial 211 (24/7 hub for all services)
- Women in Distress: 954-761-1133 (Domestic Violence shelter)
- Sheriff's Victim Services: 954-321-4200 (Crime victim support)
- Seth Line (Youth): 954-578-5640 (Teen crisis)

DUI & SUBSTANCE ABUSE:
- Broward AA Intergroup: 954-462-0265
- Narcotics Anonymous (NA): 866-504-6974
- Broward DUI Schools: 954-535-9629 (Level I/II programs)
- Ignition Interlock: 800-634-3077 (Court-mandated devices)

COURT & DIVERSION:
- SAO Diversion (DUI): 954-831-6955 (First-time offenders)
- Domestic Violence Unit: 954-831-7077 (Court info)
- Drug Court: 954-831-6345 (Treatment-based diversion)
- Mental Health Court: 954-831-6057 (Diversion/support)
`;

const ChatInterface = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hello, I'm Grace, your legal assistant for Phillip V. Menditto P.A. \n\n⚠️ **Disclaimer:** I am an AI assistant, not a lawyer. I can provide information and resources, but I cannot provide legal advice. My responses may contain errors, so please verify all information. For a professional evaluation of your case, please call our office at 954-641-9100.\n\nHow can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "I just got a DUI, what are my next steps?",
    "What are the penalties for a first-time DUI in Florida?",
    "How can Phillip Menditto help with my criminal case?",
    "What should I do after a car accident?",
    "Can I get my record expunged in Broward County?",
    "What's the difference between a misdemeanor and a felony?",
    "Where can I find free legal aid in Broward?",
    "How do I schedule a free consultation?"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([{ role: 'model', text: "Chat cleared. How else can I help you today?" }]);
  };

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input.trim();
    if (!messageToSend || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          ...messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: messageToSend }] }
        ],
        config: {
          systemInstruction: `
            You are Grace, a highly sophisticated, professional, and empathetic legal assistant for Phillip V. Menditto P.A., a premier criminal defense and personal injury law firm in Broward County, Florida.
            
            YOUR GOAL:
            Provide thorough, educational, and conversational information to users, similar to how ChatGPT or Gemini would. You should aim to be a helpful resource that explains legal concepts clearly and in detail.
            
            YOUR PERSONA:
            - Knowledgeable, articulate, and reassuring.
            - You are NOT an attorney. You CANNOT provide legal advice.
            - You are here to help users understand legal concepts, firm services, and community resources.
            
            FIRM INFORMATION:
            - Attorney: Phillip V. Menditto (Former State Prosecutor with over 20 years of experience).
            - Expertise: DUI Defense (all levels), Criminal Defense (Drug crimes, theft, assault, domestic violence), Car Accidents (Auto, Truck, Motorcycle, Uber/Lyft).
            - Key Selling Point: As a former prosecutor, Phillip knows the "other side's" playbook. He starts defense strategies immediately, often before charges are even filed.
            - Contact: Phone: ${PHONE_NUMBER}, Email: ${EMAIL}.
            - Consultation: Always offer a FREE consultation for criminal and injury cases.
            - Availability: 24/7 for emergencies.
            
            BROWARD COMMUNITY RESOURCES:
            ${BROWARD_RESOURCES}
            
            GUIDELINES FOR RESPONDING:
            1. BE EDUCATIONAL: When a user asks about a legal topic (e.g., "What is a felony?", "How does a DUI case work?"), provide a comprehensive, multi-paragraph explanation of the concept in general terms. Use analogies if helpful.
            2. THE "EXPLAIN THEN DISCLAIM" RULE: Always provide the helpful, educational information FIRST. After providing the thorough explanation, then add the disclaimer: "Please note: I am a legal assistant and cannot provide specific legal advice for your situation. However, Phillip Menditto is a former prosecutor who specializes in these cases. For a professional evaluation of your specific situation, please call our office at ${PHONE_NUMBER} for a free consultation."
            3. DUI/CRIMINAL CASES: Emphasize the importance of immediate action. Mention that Phillip can often intervene before formal charges are filed.
            4. CIVIL MATTERS (Divorce, Housing, etc.): Politely explain that the firm specializes in Criminal Defense and Personal Injury. Refer them to the specific Broward Legal Aid resources provided.
            5. TONE: Be helpful, direct, and conversational. Use bullet points for lists and bold text for emphasis.
            6. ACCURACY: Only provide information about the firm and the resources listed. Do not hallucinate other services.
            7. DISCLAIMER: Remind users occasionally that you are an AI and they should verify information.
          `,
          maxOutputTokens: 1200,
          temperature: 0.7,
        }
      });

      const botResponse = response.text || "I'm sorry, I'm having trouble connecting right now. Please call our office directly at " + PHONE_NUMBER;
      setMessages(prev => [...prev, { role: 'model', text: botResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, but I encountered an error. Please contact our office directly for immediate assistance at " + PHONE_NUMBER }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-paper">
      {/* Chat Header */}
      <div className="px-6 py-3 border-b border-navy/5 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">Live Assistant</span>
        </div>
        <button 
          onClick={clearChat}
          className="text-[9px] font-bold uppercase tracking-widest text-gold hover:text-navy transition-colors"
        >
          Clear Chat
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.length === 1 && (
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 text-center">Common Questions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-left p-3 text-xs bg-white border border-navy/5 rounded-xl hover:border-gold hover:text-gold transition-all shadow-sm flex items-center justify-between group"
                >
                  <span className="flex-1">{q}</span>
                  <ChevronRight size={14} className="text-navy/20 group-hover:text-gold transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {m.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <Scale size={14} className="text-navy" />
              </div>
            )}
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-navy text-white rounded-tr-none shadow-md' 
                : 'bg-white text-navy border border-navy/5 rounded-tl-none shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <Scale size={14} className="text-gold animate-pulse" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-navy/5 flex gap-1.5 items-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white border-t border-navy/5 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Grace a question..."
            className="flex-1 bg-paper border border-navy/10 rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all placeholder:text-navy/30"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="p-3.5 bg-navy text-gold rounded-xl hover:bg-gold hover:text-navy transition-all disabled:opacity-50 shadow-md active:scale-95 flex-shrink-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <p className="text-[9px] text-center text-navy/30 mt-3 uppercase tracking-widest font-bold">
          Confidential & Secure · Broward County Defense
        </p>
      </div>
    </div>
  );
};

const Navbar = ({ onHelpClick }: { onHelpClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#practice-areas" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 h-[70px] flex items-center ${
      scrolled ? 'bg-white/95 backdrop-blur-md border-b border-navy/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="flex flex-col">
            <span className={`font-display font-bold text-lg leading-none tracking-tight transition-colors duration-300 ${scrolled ? 'text-navy' : 'text-white'}`}>
              Phillip V. Menditto <span className="text-gold">P.A.</span>
            </span>
            <span className={`text-[9px] font-bold tracking-[0.3em] uppercase mt-1 transition-opacity duration-300 ${scrolled ? 'text-gray-legal' : 'text-white/60'}`}>
              Attorney at Law
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`font-display text-[11px] font-bold uppercase tracking-[0.15em] transition-all hover:text-gold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-gold after:transition-all hover:after:w-full ${
                  scrolled ? 'text-navy' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={onHelpClick}
              className={`font-display text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 border transition-all ${
                scrolled 
                  ? 'border-gold text-gold hover:bg-gold hover:text-white' 
                  : 'border-white/30 text-white hover:border-gold hover:text-gold'
              }`}
            >
              Need Help?
            </button>
          </div>
          <div className="flex items-center gap-8">
            <a 
              href={`tel:${PHONE_NUMBER}`} 
              className={`font-display font-bold text-sm flex items-center gap-2 transition-colors hover:text-gold ${
                scrolled ? 'text-navy' : 'text-white'
              }`}
            >
              <Phone size={14} className="text-gold" /> {PHONE_NUMBER}
            </a>
            <button className="btn-gold !px-6 !py-2.5 !text-[10px]">
              Free Consultation
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? 'text-navy' : 'text-white'
          }`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden border-t border-gray-100"
          >
            <div className="p-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className="text-navy font-head font-semibold text-base border-b border-gray-50 pb-2"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => { setIsOpen(false); onHelpClick(); }}
                className="text-gold font-head font-semibold text-base border-b border-gray-50 pb-2 text-left"
              >
                Need Help?
              </button>
              <div className="flex flex-col gap-4 pt-2">
                <a 
                  href={`tel:${PHONE_NUMBER}`} 
                  className="text-navy font-head font-semibold text-lg flex items-center gap-3"
                >
                  <Phone size={18} /> {PHONE_NUMBER}
                </a>
                <button className="bg-navy text-white p-3.5 rounded-xl font-head font-semibold text-center shadow-md">
                  Free Consultation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HelpCenter = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const categories = [
    {
      name: "Legal Aid & Referrals",
      items: [
        {
          title: "Broward Legal Aid",
          phone: "954-765-8950",
          address: "491 N State Rd 7/441, Plantation FL 33317",
          desc: "Free civil advice (no criminal defense), housing/foreclosure help; Mon-Fri 9am-5pm."
        },
        {
          title: "Coast to Coast Legal Aid",
          phone: "954-736-2400",
          address: "491 N State Rd 7, Plantation FL 33317",
          desc: "Free civil services for low-income Broward; apply online/phone; family/safety focus."
        },
        {
          title: "Broward Clerk Self-Help",
          phone: "954-831-7019",
          address: "Central Courthouse, 201 SE 6th St, Ft Lauderdale",
          desc: "Forms/filing help (Mon-Fri 8am-3:30pm); mental health court Rm 03160."
        },
        {
          title: "Florida Senior/Vets Helpline",
          phone: "888-895-7873",
          desc: "Legal aid referrals for vulnerable groups (Seniors: 888-895-7873 / Vets: 866-486-6161)."
        },
        {
          title: "Bail Bonds Referrals",
          phone: "954-831-5848",
          desc: "Quick release info; avoid unverified bondsmen—use official lists (211 or Broward Clerk)."
        }
      ]
    },
    {
      name: "Crisis & Victim Support",
      items: [
        {
          title: "211 Broward (24/7)",
          phone: "211",
          desc: "All services: mental health, food, housing, legal referrals; first call hub."
        },
        {
          title: "Women in Distress",
          phone: "954-761-1133",
          address: "2858 N State Rd 7, Margate FL 33063",
          desc: "24hr Domestic Violence shelter, counseling, kids support; safety planning."
        },
        {
          title: "Sheriff's Victim Services",
          phone: "954-321-4200",
          desc: "Crime victim/witness support, crisis counseling, court info, VINE notifications."
        },
        {
          title: "Seth Line (Youth)",
          phone: "954-578-5640",
          desc: "Teen crisis support (evenings/weekends); dial 911 for emergencies."
        }
      ]
    },
    {
      name: "DUI & Substance Abuse",
      items: [
        {
          title: "Broward AA Intergroup",
          phone: "954-462-0265",
          address: "3317 NW 10th Terr #404, Ft Lauderdale",
          desc: "Meeting finder/schedules; office hours M-F."
        },
        {
          title: "Narcotics Anonymous (NA)",
          phone: "866-504-6974",
          address: "Pride Center at Equality Park, Ft Lauderdale",
          desc: "Multiple weekly meetings (Tues-Thurs-Fri 6:30pm+); recovery support."
        },
        {
          title: "Broward DUI Schools",
          phone: "954-535-9629",
          desc: "Level I/II programs; Broward Safety Council or Metro Traffic School (954-922-3000)."
        },
        {
          title: "Ignition Interlock",
          phone: "800-634-3077",
          desc: "Court-mandated devices ($3/day+); LifeSafer or RoadGuard local providers."
        }
      ]
    },
    {
      name: "Court & Diversion",
      items: [
        {
          title: "SAO Diversion Programs",
          link: "https://sao.browardclerk.org",
          desc: "Pre-trial intervention for misdemeanors/DUI first-timers (eligibility screening)."
        },
        {
          title: "SAO Domestic Violence",
          phone: "954-831-7978",
          desc: "Victim advocates, injunctions; Clerk for orders: 954-831-7693."
        },
        {
          title: "Pretrial Services / Drug Court",
          phone: "954-831-5570",
          desc: "Diversion for misdemeanors/drug offenses; eligibility screening post-arrest."
        }
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-navy/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-5xl h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-2xl"
          >
            {/* Sidebar: Resources & Disclaimer */}
            <div className="w-full md:w-96 bg-paper border-r border-navy/5 flex flex-col overflow-y-auto">
              <div className="p-6 bg-navy text-white flex justify-between items-center md:hidden">
                <span className="font-serif font-bold">Help Center</span>
                <button onClick={onClose}><X size={20} /></button>
              </div>
              
              <div className="p-6">
                <h3 className="font-serif font-bold text-xl text-navy mb-4">Free Resources</h3>
                <p className="text-xs text-gray-legal mb-8 font-light">Comprehensive community resources for Broward County residents.</p>
                
                <div className="space-y-8">
                  {categories.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold mb-4 border-b border-gold/20 pb-1">
                        {cat.name}
                      </h4>
                      <div className="space-y-4">
                        {cat.items.map((res, i) => (
                          <details key={i} className="group border-b border-navy/5 pb-3">
                            <summary className="font-display font-bold text-[10px] uppercase tracking-widest text-navy cursor-pointer hover:text-gold transition-colors flex justify-between items-center list-none">
                              {res.title}
                              <ChevronRight size={12} className="group-open:rotate-90 transition-transform" />
                            </summary>
                            <div className="mt-2 text-[11px] text-gray-legal font-light leading-relaxed">
                              <p className="mb-2">{res.desc}</p>
                              {res.address && <p className="mb-2 text-[9px] opacity-70 italic">{res.address}</p>}
                              <div className="flex flex-wrap gap-3">
                                {res.phone && <a href={`tel:${res.phone}`} className="text-gold font-bold hover:underline">{res.phone}</a>}
                                {res.link && <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-gold font-bold hover:underline">Website</a>}
                              </div>
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-4 bg-navy/5 border border-navy/10 rounded-lg">
                  <h4 className="font-display font-bold text-[9px] uppercase tracking-widest text-navy mb-2">Legal Disclaimer</h4>
                  <p className="text-[10px] text-gray-legal leading-relaxed font-light italic">
                    Grace is an AI assistant for informational purposes only. It does not provide legal advice and use of this tool does not create an attorney-client relationship. Phillip V. Menditto P.A. is not liable for actions taken based on this information.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative bg-white">
              <div className="hidden md:flex p-6 border-b border-navy/5 justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-serif font-bold text-navy">Grace - Legal Assistant</span>
                </div>
                <button onClick={onClose} className="text-navy/40 hover:text-navy transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 w-full bg-paper">
                <ChatInterface />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-[70px] overflow-hidden bg-navy-deep">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/Screenshot 2026-03-19 095057.png" 
          alt="Attorney Phillip Menditto" 
          className="w-full h-full object-cover object-[right_top] animate-slow-zoom origin-top-right"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/90 via-navy-deep/60 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-24 md:py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-6">
              <div className="w-12 h-px bg-gold" />
              Elite Legal Defense
            </div>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-7xl !text-white leading-[1.05] mb-8 tracking-tight drop-shadow-lg uppercase">
              Broward DUI & <br />
              <span className="text-gold">Criminal Defense</span>
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-white/80 mb-12 max-w-xl leading-relaxed font-light">
              Former Prosecutor Phillip Menditto provides aggressive, 24/7 representation for those facing serious charges in South Florida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <a 
                href={`tel:${PHONE_NUMBER}`}
                className="btn-gold !px-10 !py-5 flex items-center justify-center gap-3"
              >
                <Phone size={18} /> Call Now: {PHONE_NUMBER}
              </a>
              <button className="px-10 py-5 border border-white/20 text-white font-display font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-navy transition-all">
                Case Evaluation
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PracticeAreas = () => {
  const services = [
    { 
      name: "DUI Defense", 
      id: "dui",
      icon: <AlertTriangle size={24} />, 
      desc: "Charges Reduced or Dismissed. We fight for your license and your freedom.",
      bullets: ["First Time DUI", "Multiple Offenses", "License Suspension", "BUI Defense"]
    },
    { 
      name: "Car Accidents", 
      id: "injury",
      icon: <Car size={24} />, 
      desc: "Maximum compensation for medical bills, lost wages, and pain and suffering.",
      bullets: ["Auto Accidents", "Truck Accidents", "Motorcycle Crashes", "Uber/Lyft Claims"]
    },
    { 
      name: "Drug Crimes", 
      id: "drug-crimes",
      icon: <Shield size={24} />, 
      desc: "Aggressive defense for possession, trafficking, and distribution charges.",
      bullets: ["Possession", "Trafficking", "Prescription Fraud", "Search & Seizure"]
    },
  ];

  return (
    <section className="py-32 bg-white" id="practice-areas">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <div className="inline-flex items-center gap-3 text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-6">
            <div className="w-12 h-px bg-gold" />
            Practice Areas
          </div>
          <h2 className="font-serif font-bold text-4xl md:text-6xl text-navy leading-tight">
            Expert Legal <span className="text-gold italic">Representation</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative p-8 border border-navy/5 hover:border-gold transition-all duration-500 flex flex-col ${
                idx === 0 
                  ? 'md:col-span-2 lg:col-span-2 bg-navy text-white' 
                  : 'bg-paper justify-between'
              }`}
            >
              <div>
                <div className={`${idx === 0 ? 'text-gold' : 'text-gold'} mb-6`}>{s.icon}</div>
                <h3 className={`font-serif font-bold text-2xl mb-4 ${idx === 0 ? 'text-white' : 'text-navy'} group-hover:text-gold transition-colors`}>
                  {s.name}
                </h3>
                <p className={`text-base font-light leading-relaxed mb-6 ${idx === 0 ? 'text-white/70' : 'text-gray-legal'}`}>
                  {s.desc}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
                  {s.bullets.map(b => (
                    <span key={b} className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 ${idx === 0 ? 'text-white/40' : 'text-navy/40'}`}>
                      <div className="w-1 h-1 bg-gold rounded-full" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <button className={`font-display font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 group/btn ${idx === 0 ? 'text-gold' : 'text-navy'}`}>
                View Details <ChevronRight className="text-gold group-hover/btn:translate-x-2 transition-transform" size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DefenseStrategy = () => {
  const points = [
    {
      title: "The Best Option",
      text: "Start your defense right away! DO NOT wait for a public defender who you will meet in court. In South Florida, the best criminal defense attorneys begin your defense strategy immediately, giving your case the attention it needs. Direct contact with your attorney right away is critical to a successful outcome.",
      highlight: "Immediate Action"
    },
    {
      title: "Immediate Defense",
      text: "Phillip Menditto begins working immediately in that short window of time before charges are officially filed and before a court date is set. He meets with the state prosecutor to do everything possible to get your charges reduced or dismissed before you ever head to trial.",
      highlight: "Pre-File Intervention"
    },
    {
      title: "Avoid Going to Trial",
      text: "After an arrest, the police typically take 2-4 weeks to prepare evidence for the State of Florida. During this period, the State Attorney can drop, raise, or maintain charges. Having an experienced attorney during this window is your best chance to avoid a trial entirely.",
      highlight: "Case Evaluation Period"
    }
  ];

  return (
    <section className="py-32 bg-navy text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border border-gold rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-gold rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="inline-flex items-center gap-3 text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-6">
              <div className="w-12 h-px bg-gold" />
              The Defense Process
            </div>
            <h2 className="font-serif font-bold text-4xl md:text-6xl text-white mb-10 leading-tight">
              Your Best Chance for a <br />
              <span className="text-gold italic">Successful Outcome</span>
            </h2>
            <p className="text-white/60 text-xl font-light leading-relaxed mb-12">
              If you've been arrested, the clock is ticking. Hiring an experienced Broward defense lawyer immediately is the most important decision you can make for your future.
            </p>
            <div className="p-10 bg-gold/10 border border-gold/20">
              <h4 className="font-serif font-bold text-2xl text-gold mb-4">Don't Wait for a Public Defender</h4>
              <p className="text-white/80 font-light leading-relaxed mb-8">
                Public defenders are chronically overloaded with case work and often cannot provide the immediate, personalized attention your case requires.
              </p>
              <a href={`tel:${PHONE_NUMBER}`} className="btn-gold">
                Protect Your Rights Now
              </a>
            </div>
          </div>

          <div className="space-y-20 relative">
            <div className="absolute left-0 top-0 w-px h-full bg-white/10 ml-8 hidden md:block" />
            {points.map((point, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative pl-24 group"
              >
                <div className="absolute left-0 top-0 font-serif font-bold text-7xl text-gold/20 group-hover:text-gold/40 transition-colors duration-500 leading-none">
                  0{idx + 1}
                </div>
                <div className="relative z-10">
                  <div className="text-gold font-display font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">
                    {point.highlight}
                  </div>
                  <h3 className="font-serif font-bold text-3xl mb-6 text-white group-hover:text-gold transition-colors duration-300">
                    {point.title}
                  </h3>
                  <p className="text-white/70 text-lg font-light leading-relaxed max-w-xl">
                    {point.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Kaelyn",
      rating: 5,
      title: "Absolutely Amazing",
      text: "First time ever hiring an attorney and I couldn't be more pleased with choosing Philip Menditto! He's absolutely amazing at what he does, very efficient and got the charges dropped quicker than I ever anticipated.",
      date: "July 2017",
      featured: true
    },
    {
      name: "Lisa",
      rating: 5,
      title: "Excellent Lawyer",
      text: "I have just finished working with Phillip and his fantastic assistant Yesenia on a case involving my two sons. He helped them through a very trying case that could have deeply impacted their futures.",
      date: "July 2017",
      featured: true
    },
    {
      name: "Steven OConnor",
      rating: 5,
      text: "Huge thank you to Phil. Wonderful to work with!!",
      date: "4 months ago",
      response: "Thanks Steve, very appreciated. Phillip"
    }
  ];

  return (
    <section className="py-32 bg-white overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center gap-3 text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-6">
            <div className="w-12 h-px bg-gold" />
            Client Testimonials
          </div>
          <h2 className="font-serif font-bold text-4xl md:text-6xl text-navy leading-tight mb-8">
            The Verdict <span className="text-gold italic">is In.</span>
          </h2>
          <p className="text-gray-legal text-lg max-w-2xl font-light leading-relaxed">
            Our commitment to justice is reflected in the words of those we've represented. We take every case personally.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-8">
            {reviews.filter(r => r.featured).map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative p-10 md:p-12 bg-navy text-white flex-1 overflow-hidden flex flex-col justify-center"
              >
                <div className="absolute -top-10 -left-10 opacity-10 pointer-events-none">
                  <MessageSquare size={200} className="text-gold" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <h3 className="font-serif font-bold text-2xl md:text-4xl mb-6 leading-tight tracking-tight">
                    {review.title}
                  </h3>
                  <p className="text-lg md:text-xl font-light leading-relaxed mb-8 text-white/80 italic border-l-4 border-gold/30 pl-6">
                    "{review.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                    <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center font-serif font-bold text-xl text-gold">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs uppercase tracking-widest">
                        {review.name}
                      </h4>
                      <p className="text-[9px] font-bold text-gold uppercase tracking-[0.3em] mt-1">Verified Client · {review.date}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="p-12 bg-paper border border-navy/5 flex-1">
              <h3 className="font-serif font-bold text-2xl text-navy mb-10 flex items-center gap-4">
                <div className="w-8 h-px bg-gold" />
                Recent Success Stories
              </h3>
              <div className="space-y-12">
                {reviews.filter(r => !r.featured).map((review, idx) => (
                  <div key={idx} className="group relative">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={8} className="text-gold fill-gold" />
                      ))}
                    </div>
                    <p className="text-gray-legal text-base font-light leading-relaxed mb-6 italic">
                      "{review.text}"
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-navy/5">
                      <span className="font-display font-bold text-[10px] uppercase tracking-widest text-navy">{review.name}</span>
                      <span className="text-[9px] text-gray-legal/50 uppercase font-bold">{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-12 py-5 border border-navy/10 text-navy font-display font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-navy hover:text-white transition-all">
                Read More Reviews
              </button>
            </div>

            <div className="p-12 bg-gold text-navy relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Scale size={200} />
              </div>
              <h4 className="font-serif font-bold text-3xl mb-4 relative z-10">Ready to Win?</h4>
              <p className="text-base font-light mb-10 opacity-80 relative z-10">Join our long list of satisfied clients and get the defense you deserve.</p>
              <a href={`tel:${PHONE_NUMBER}`} className="inline-flex items-center gap-3 font-display font-bold text-[11px] uppercase tracking-[0.2em] border-b-2 border-navy pb-2 relative z-10 hover:gap-5 transition-all">
                Schedule Your Consultation <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-24 flex justify-center">
          <button className="btn-primary">
            View All Success Stories
          </button>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="py-32 bg-navy text-white relative overflow-hidden" id="contact">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 -skew-x-12 transform translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-3 text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-8">
              <div className="w-12 h-px bg-gold" />
              Contact Us
            </div>
            <h2 className="font-serif font-bold text-4xl md:text-6xl mb-10 leading-tight text-white">
              Request a <br />
              <span className="text-gold italic">Consultation</span>
            </h2>
            <p className="text-lg text-white/60 mb-12 leading-relaxed font-light">
              Available 24/7 for legal emergencies. Your information is strictly confidential.
            </p>
            
            <div className="space-y-12">
              <div className="flex items-start gap-8 group">
                <div className="text-gold mt-1">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mb-2">Emergency Line</p>
                  <a href={`tel:${PHONE_NUMBER}`} className="text-3xl font-serif font-bold hover:text-gold transition-colors">{PHONE_NUMBER}</a>
                </div>
              </div>
              
              <div className="flex items-start gap-8 group">
                <div className="text-gold mt-1">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mb-2">Direct Email</p>
                  <p className="text-xl font-serif font-bold">info@phillipmenditto.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="bg-white p-12 shadow-2xl">
              <h3 className="font-serif font-bold text-3xl text-navy mb-10">Case Details</h3>
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">Full Name</label>
                    <input type="text" className="w-full bg-paper border-b border-navy/10 p-4 focus:outline-none focus:border-gold transition-all text-navy" placeholder="John Doe" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">Phone Number</label>
                    <input type="tel" className="w-full bg-paper border-b border-navy/10 p-4 focus:outline-none focus:border-gold transition-all text-navy" placeholder="(555) 000-0000" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">Email Address</label>
                  <input type="email" className="w-full bg-paper border-b border-navy/10 p-4 focus:outline-none focus:border-gold transition-all text-navy" placeholder="john@example.com" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">Message</label>
                  <textarea className="w-full bg-paper border-b border-navy/10 p-4 h-32 focus:outline-none focus:border-gold transition-all text-navy resize-none" placeholder="Briefly describe your situation..."></textarea>
                </div>
                <button className="btn-primary w-full !py-6">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-navy-deep text-white pt-32 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-20 mb-24">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-10">
              <div className="leading-tight">
                <div className="text-2xl font-display font-bold tracking-tight">PHILLIP V. MENDITTO <span className="text-gold">P.A.</span></div>
                <div className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 mt-1">Attorney at Law</div>
              </div>
            </div>
            <p className="text-white/50 max-w-md leading-relaxed mb-12 text-base font-light">
              Serving Fort Lauderdale, Broward County, Miami-Dade, and Palm Beach. We are committed to the best outcome for YOU! No matter what the circumstances are, we will fight for you!
            </p>
            <div className="flex gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all duration-500 cursor-pointer">
                  <Star size={14} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-display font-bold mb-10 text-gold uppercase tracking-[0.3em] text-[10px]">Navigation</h4>
            <ul className="space-y-5 text-[11px] text-white/40 font-bold uppercase tracking-widest">
              <li><a href="#practice-areas" className="hover:text-gold transition-colors">Practice Areas</a></li>
              <li><a href="#testimonials" className="hover:text-gold transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-gold transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-display font-bold mb-10 text-gold uppercase tracking-[0.3em] text-[10px]">Legal</h4>
            <ul className="space-y-5 text-[11px] text-white/40 font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Sitemap</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display font-bold mb-10 text-gold uppercase tracking-[0.3em] text-[10px]">Office</h4>
            <div className="bg-white/5 p-8 border border-white/10">
              <p className="text-[11px] text-white font-bold uppercase tracking-widest mb-4">Fort Lauderdale</p>
              <p className="text-sm text-white/40 leading-relaxed mb-6 font-light">
                Serving all of Broward County and South Florida.
              </p>
              <a href={`tel:${PHONE_NUMBER}`} className="text-gold font-serif font-bold text-2xl hover:text-white transition-colors">{PHONE_NUMBER}</a>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
          <p>© {new Date().getFullYear()} Phillip V. Menditto P.A. All Rights Reserved.</p>
          <div className="flex gap-12">
            <span>Attorney Advertising</span>
            <span>Fort Lauderdale, Florida</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ChatTab = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      {/* Desktop Side Tab */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] hidden md:block"
      >
        <button 
          onClick={onClick}
          className="bg-gold text-navy font-display font-bold text-[10px] uppercase tracking-[0.3em] py-8 px-3 [writing-mode:vertical-rl] rotate-180 flex items-center gap-4 hover:bg-navy hover:text-white transition-all duration-500 shadow-2xl border-l border-navy/10 group rounded-l-xl"
        >
          <MessageSquare size={16} className="-rotate-90 group-hover:scale-110 transition-transform" />
          Chat with us
        </button>
      </motion.div>

      {/* Mobile Floating Button */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="fixed bottom-6 right-6 z-[90] md:hidden"
      >
        <button 
          onClick={onClick}
          className="w-14 h-14 bg-gold text-navy rounded-full flex items-center justify-center shadow-2xl border border-navy/10 active:scale-95 transition-transform"
        >
          <MessageSquare size={24} />
        </button>
      </motion.div>
    </>
  );
};

export default function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gold selection:text-navy">
      <Navbar onHelpClick={() => setIsHelpOpen(true)} />
      <ChatTab onClick={() => setIsHelpOpen(true)} />
      <main>
        <Hero />
        
        <PracticeAreas />

        <DefenseStrategy />
        
        {/* Call to Action Banner */}
        <section className="bg-gold py-16 overflow-hidden relative">
          <div className="absolute inset-0 bg-navy/5" />
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-navy max-w-2xl">
              <h2 className="font-serif font-bold text-3xl md:text-4xl mb-4 leading-tight">Need Immediate Legal Assistance?</h2>
              <p className="text-lg font-light opacity-80">Our elite defense team is standing by to review your case 24/7. Your future is our priority.</p>
            </div>
            <a href={`tel:${PHONE_NUMBER}`} className="btn-primary !bg-navy !text-white !px-12 !py-6 flex items-center gap-4 shadow-2xl">
              <Phone size={20} /> {PHONE_NUMBER}
            </a>
          </div>
        </section>

        <Testimonials />
        
        {/* Why Choose Us */}
        <section className="section-padding bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 text-gold font-bold text-[10px] tracking-[0.4em] uppercase mb-8">
              <div className="w-12 h-px bg-gold" />
              The Menditto Advantage
            </div>
            <h2 className="font-serif font-bold text-5xl md:text-7xl text-navy mb-12 leading-[1.1] tracking-tight">
              The Power of <br />
              <span className="text-gold italic">Prosecutorial Insight</span>
            </h2>
            <p className="text-gray-legal mb-16 leading-relaxed text-xl font-light max-w-2xl">
              Phillip Menditto is a former Prosecuting Attorney with the State Attorney's Office. This unique background provides an invaluable advantage in anticipating the prosecution's strategy and building a superior defense.
            </p>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
              {[
                { title: "Available 24/7", desc: "Legal emergencies don't wait for business hours. We are always here when you need us most.", icon: <Clock size={28} /> },
                { title: "Former Prosecutor", desc: "Unique insight into how the other side thinks and builds their case against you.", icon: <Scale size={28} /> },
                { title: "Award Winning", desc: "Recognized as one of the top law firms in Broward County for criminal defense.", icon: <Award size={28} /> },
                { title: "Direct Access", desc: "You work directly with Phillip Menditto, not just paralegals or junior associates.", icon: <MessageSquare size={28} /> }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="text-gold mb-6 transition-transform group-hover:translate-x-2 duration-500">
                    {item.icon}
                  </div>
                  <h4 className="font-serif font-bold text-2xl text-navy mb-4">{item.title}</h4>
                  <p className="text-base text-gray-legal font-light leading-relaxed opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-navy transform rotate-3 scale-105 opacity-5 rounded-3xl" />
            <div className="relative z-10 bg-white p-10 md:p-12 border border-navy/5 shadow-2xl rounded-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-px bg-gold" />
                <h3 className="font-serif font-bold text-2xl text-navy">Our Commitment</h3>
              </div>
              
              <ul className="space-y-6">
                {[
                  "Free, no-obligation initial consultations",
                  "Personalized attention to every single case",
                  "Proven track record of winning results",
                  "Aggressive representation in and out of court"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="w-5 h-5 rounded-full border border-gold/30 flex items-center justify-center shrink-0 mt-1 group-hover:bg-gold transition-colors duration-300">
                      <CheckCircle2 className="text-gold group-hover:text-navy transition-colors" size={10} />
                    </div>
                    <span className="text-[10px] text-navy font-bold uppercase tracking-[0.2em] leading-relaxed pt-1">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10 pt-8 border-t border-navy/5">
                <p className="text-xs text-gray-legal font-light mb-6 italic">"We treat every client like family and every case like our own."</p>
                <a href={`tel:${PHONE_NUMBER}`} className="btn-gold w-full flex items-center justify-center gap-3 !py-4">
                  <Phone size={16} /> Get Help Now
                </a>
              </div>
            </div>
          </div>
        </div>
          </div>
        </section>

        <ContactSection />
      </main>
      
      <Footer />
      <HelpCenter isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
