import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Settings, RefreshCw, Bot, Mic, FileText, ChevronRight, Bell } from "lucide-react"
import Avatar from "../components/common/Avatar"
import Badge from "../components/common/Badge"
import profileImg from "../assets/icons/profile.png"
import aiIcon from "../assets/icons/AI.png"

const suggestedPrompts = [
  { text: "Create exam study plan", icon: "📅" },
  { text: "Explain a difficult concept", icon: "💡" },
  { text: "Summarize lecture notes", icon: "📝" },
  { text: "Generate practice quiz", icon: "🧠" },
]

const aiTips = [
  {
    icon: "🧠",
    title: "Active Recall Tip",
    text: "Try explaining what you learned to the assistant to lock in your understanding."
  },
  {
    icon: "⏱️",
    title: "Optimal Session Length",
    text: "Your average focus drops after 45 mins. Ask AI to segment your sessions!"
  }
]

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Hi Nirmal! I'm your AI study assistant. I can help you plan your schedule, answer subject questions, or guide your revision. What would you like to work on today?",
    time: "10:30 AM"
  },
  {
    id: 2,
    role: "user",
    content: "How should I quickly revise Chemistry for the upcoming exam?",
    time: "10:31 AM"
  },
  {
    id: 3,
    role: "assistant",
    content: "For a quick Chemistry revision, focus on these top priorities:\n\n1. **Organic Chemistry**: Reaction mechanisms and functional groups.\n2. **Electrochemistry**: Redox equations and cell potentials.\n3. **Chemical Equilibrium**: Le Chatelier's principle and equilibrium constants.\n\nWould you like me to generate a custom 3-day revision timetable for these topics?",
    time: "10:32 AM"
  }
]

const quickActions = [
  "Make New Timetable",
  "Optimize My Week",
  "Catch-Me-Up",
  "Generate Revision Plan",
  "Help Me Focus"
]

function AIChatPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSend(textToSend) {
    const text = textToSend || inputValue
    if (!text.trim()) return

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInputValue("")

    // Trigger AI typing response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const aiResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: `I've received your query about "${text}". As your study assistant, I suggest we break this down into smaller steps. What specific part should we focus on first?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header Card ── */}
      <div className="bg-gradient-to-br from-[#1A3D63] to-[#0A1931] text-white rounded-2xl p-6 shadow-xl border border-white/10 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute right-[-10%] top-[-30%] w-96 h-96 bg-[#4A7FA7] opacity-25 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm" className="bg-green-500/20 text-green-400 border border-green-500/30">
                ● AI ACTIVE
              </Badge>
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">AI Assistant Center</h2>
            <p className="font-body text-sm text-[#B3CFE5] max-w-2xl leading-relaxed">
              Your intelligent academic partner — handles study planning, instant subject help, and personalized guidance so you can focus on learning.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-[#B3CFE5]/80 font-body">
              <span>💬 Ready to help in real-time</span>
              <span>⚡ Powered by advanced models</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl font-body text-xs font-semibold border border-white/10 transition-all">
              <Settings size={14} />
              Settings
            </button>
            <button 
              onClick={() => setMessages(initialMessages)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#0A1931] hover:bg-[#F6FAFD] rounded-xl font-body text-xs font-bold transition-all shadow-md"
            >
              <RefreshCw size={14} />
              Reset Chat
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Sidebar (Tools & Suggested Prompts) ── */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Suggested Topics Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
              <Sparkles size={16} className="text-[#4A7FA7]" />
              <h3 className="font-heading text-sm font-semibold text-[#0A1931]">Suggested Study Topics</h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handleSend(prompt.text)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#4A7FA7]/30 hover:bg-gray-50/50 text-left transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{prompt.icon}</span>
                    <span className="font-body text-xs font-semibold text-gray-600 group-hover:text-[#1A3D63]">
                      {prompt.text}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-[#4A7FA7] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* AI Tips Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
              <Bot size={16} className="text-[#4A7FA7]" />
              <h3 className="font-heading text-sm font-semibold text-[#0A1931]">AI Assistant Insights</h3>
            </div>
            <div className="space-y-4">
              {aiTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 bg-[#F6FAFD] rounded-xl border border-gray-50">
                  <span className="text-xl mt-0.5">{tip.icon}</span>
                  <div>
                    <h4 className="font-heading text-xs font-bold text-[#1A3D63]">{tip.title}</h4>
                    <p className="font-body text-[11px] text-gray-500 mt-1 leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Column (Ask AI Workspace) ── */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[600px]">
          
          {/* Chat Window Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#F6FAFD]">
            <div className="flex items-center gap-3">
              <Avatar src={aiIcon} name="AI" color="primary" size="md" />
              <div>
                <h3 className="font-heading text-sm font-bold text-[#0A1931]">Ask AI</h3>
                <p className="font-body text-[10px] text-green-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                  Your personalized study assistant is online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-[#4A7FA7]/10 text-[#4A7FA7] rounded font-body text-[10px] font-bold">
                GPT-4o
              </span>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <Avatar 
                  src={msg.role === "user" ? profileImg : aiIcon} 
                  name={msg.role === "user" ? "User" : "AI"} 
                  color={msg.role === "user" ? "accent" : "primary"}
                  size="sm" 
                />
                <div>
                  <div className={`rounded-2xl px-4 py-3 shadow-sm font-body text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user" 
                      ? "bg-[#1A3D63] text-white rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                  <span className={`block font-body text-[9px] text-gray-400 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                <Avatar src={aiIcon} name="AI" color="primary" size="sm" />
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-5 pt-3 pb-2 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
            <span className="font-body text-[10px] text-gray-400 font-semibold mr-1">QUICK ACTIONS:</span>
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="font-body text-[10px] font-semibold px-2.5 py-1 bg-white hover:bg-[#F6FAFD] text-gray-500 hover:text-[#1A3D63] rounded-lg border border-gray-200 hover:border-[#4A7FA7]/30 shadow-sm transition-all"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#4A7FA7]/50 focus-within:bg-white transition-all duration-200">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything — subject help, study planning, advice..."
                className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors">
                  <Mic size={15} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-colors">
                  <FileText size={15} />
                </button>
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className={`p-1.5 rounded-lg text-white shadow-md transition-all ${
                    inputValue.trim() 
                      ? "bg-[#1A3D63] hover:bg-[#4A7FA7]" 
                      : "bg-gray-300 cursor-not-allowed shadow-none"
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default AIChatPage