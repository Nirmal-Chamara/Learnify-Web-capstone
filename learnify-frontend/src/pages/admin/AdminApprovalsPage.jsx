import { useState } from "react"
import {
  Clock, UserCheck, CheckCircle2, XCircle,
  FileText, Download, Star, Sparkles,
  ChevronRight, BookOpen, Users, Award,
  AlertTriangle, ArrowRight
} from "lucide-react"

// ── Mock data ──
const FEATURED_CANDIDATE = {
  id: "APP-2024-0091",
  name: "Julian Vance, M.Sc.",
  badge: "TOP TIER",
  institution: "Oxford University Alumni",
  bio: "12+ years of research in behavioral economics. Seeking to mentor graduate students in experimental design and ethical research methodologies.",
  quote: "\"My goal is to cultivate a space where rigorous academic standards meet innovative thinking. I've guided 15+ students through successful thesis defenses in the last 3 years.\"",
  expertise: ["Cognitive Psychology", "Data Ethics"],
  document: { name: "Curriculum_Vitae_2024.pdf", size: "2.4 MB · PDF" },
  teachingHours: "1,240+",
  publications: "8 Peer-Reviewed",
  avatar: "JV",
  avatarBg: "bg-[#1A3D63]",
}

const AI_MATCH = {
  name: "Dr. Linda Sterling",
  field: "Computational Neuroscience",
  fitScore: 98,
  urgency: "High",
  credentials: [
    "Dual Ph.D. in Biology & Computer Science",
    "MIT Research Fellow (2021–2023)",
  ],
  avatar: "LS",
  avatarBg: "bg-emerald-600",
}

const OTHER_APPLICANTS = [
  { id: "APP-2024-0092", name: "Sarah Jenkins",   field: "Advanced Physics",       time: "2 days ago",  avatar: "SJ", avatarBg: "bg-blue-500"   },
  { id: "APP-2024-0093", name: "Marcus Holloway", field: "Political Science",       time: "5 days ago",  avatar: "MH", avatarBg: "bg-purple-500" },
  { id: "APP-2024-0094", name: "Elena Rodriguez", field: "Comparative Literature",  time: "1 week ago",  avatar: "ER", avatarBg: "bg-rose-500"   },
]

const STATS = [
  {
    label: "Pending Review",  value: "143",  badge: "Urgent",
    badgeBg: "bg-red-50 text-red-600",
    icon: Clock, iconBg: "bg-orange-50 text-orange-500",
  },
  {
    label: "Approved (Month)", value: "58",  badge: "+24%",
    badgeBg: "bg-teal-50 text-teal-600",
    icon: UserCheck, iconBg: "bg-teal-50 text-teal-600",
  },
  {
    label: "Avg. Review Time", value: "1.4d", badge: "Fast",
    badgeBg: "bg-blue-50 text-blue-600",
    icon: CheckCircle2, iconBg: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Mentors",   value: "892", dot: true,
    icon: Users, iconBg: "bg-green-50 text-green-600",
  },
]

// ── Confirm modal ──
function ConfirmModal({ action, name, onConfirm, onClose }) {
  const isApprove = action === "approve"
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className={`px-6 py-5 ${isApprove ? "bg-teal-50" : "bg-red-50"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            isApprove ? "bg-teal-100" : "bg-red-100"
          }`}>
            {isApprove
              ? <CheckCircle2 size={20} className="text-teal-600" />
              : <XCircle      size={20} className="text-red-500"  />
            }
          </div>
          <h3 className="font-heading text-base font-bold text-[#0A1931]">
            {isApprove ? "Approve Candidate?" : "Reject Candidate?"}
          </h3>
          <p className="font-body text-sm text-gray-500 mt-1">
            {isApprove
              ? `${name} will be approved and notified via email.`
              : `${name}'s application will be rejected and archived.`}
          </p>
        </div>
        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-body text-sm font-semibold
              py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white font-body text-sm font-semibold py-2.5 rounded-xl
              transition-colors shadow-sm ${
              isApprove
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminApprovalsPage() {
  const [approved,     setApproved]     = useState(false)
  const [rejected,     setRejected]     = useState(false)
  const [confirmModal, setConfirmModal] = useState(null) // "approve" | "reject" | null

  function handleConfirm() {
    if (confirmModal === "approve") setApproved(true)
    if (confirmModal === "reject")  setRejected(true)
    setConfirmModal(null)
  }

  const actionDone = approved || rejected

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-[#0A1931]">

      {/* ── Breadcrumb & Heading ── */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-body text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            Academic Workspace
          </span>
          <ChevronRight size={11} className="text-gray-300" />
          <span className="font-body text-[10px] text-[#4A7FA7] uppercase tracking-wider font-semibold">
            Mentor Approvals
          </span>
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-[#0A1931]">Pending Applications</h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Review and verify candidates applying for the 2024 Senior Mentorship cohort.
          Ensure all credentials align with institutional standards.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-body text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  {card.label}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-heading text-xl font-extrabold text-[#0A1931]">{card.value}</span>
                  {card.badge && (
                    <span className={`font-body text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${card.badgeBg}`}>
                      {card.badge}
                    </span>
                  )}
                  {card.dot && (
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Featured Candidate Card ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Status banner if actioned */}
          {actionDone && (
            <div className={`flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl text-sm font-semibold font-body ${
              approved ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-600"
            }`}>
              {approved
                ? <><CheckCircle2 size={16} /> Julian Vance has been approved and notified.</>
                : <><XCircle      size={16} /> Julian Vance's application has been rejected.</>
              }
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6">

            {/* Avatar / Profile visual */}
            <div className="flex-shrink-0">
              <div className="w-36 h-40 rounded-2xl bg-gradient-to-br from-[#1A3D63] to-[#0A1931]
                flex flex-col items-center justify-end pb-4 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <div className={`w-14 h-14 rounded-full ${FEATURED_CANDIDATE.avatarBg}
                      border-2 border-white/30 flex items-center justify-center`}>
                      <span className="font-heading text-xl font-extrabold text-white">
                        {FEATURED_CANDIDATE.avatar}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-body text-[10px] text-white/60 relative z-10 text-center px-2">
                  Safe frun work
                </p>
                <div className="mt-1.5 bg-[#4A7FA7] rounded-lg px-3 py-1 relative z-10">
                  <span className="font-body text-[9px] text-white font-bold uppercase tracking-wide">
                    Ph.D. Candidate
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-heading text-lg font-extrabold text-[#0A1931]">
                      {FEATURED_CANDIDATE.name}
                    </h2>
                    <span className="flex items-center gap-1 bg-amber-50 border border-amber-200
                      text-amber-600 font-body text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                      <Star size={9} className="fill-amber-400 stroke-amber-400" />
                      {FEATURED_CANDIDATE.badge}
                    </span>
                  </div>
                  <p className="font-body text-xs text-gray-500 mt-0.5">
                    {FEATURED_CANDIDATE.institution}
                  </p>
                </div>
              </div>

              <p className="font-body text-sm text-gray-600 mt-2 leading-relaxed">
                {FEATURED_CANDIDATE.bio}
              </p>

              {/* Quote */}
              <blockquote className="mt-3 border-l-2 border-[#4A7FA7] pl-3 text-sm italic text-gray-500 font-body leading-relaxed">
                {FEATURED_CANDIDATE.quote}
              </blockquote>

              {/* Expertise tags */}
              <div className="mt-3">
                <p className="font-body text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                  Subject Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {FEATURED_CANDIDATE.expertise.map(tag => (
                    <span key={tag}
                      className="font-body text-xs font-semibold px-3 py-1 rounded-lg
                        bg-[#EBF3F9] text-[#1A3D63] border border-[#B3CFE5]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document */}
              <div className="mt-3">
                <p className="font-body text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                  Documents
                </p>
                <div className="inline-flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2
                  bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold text-[#0A1931]">
                      {FEATURED_CANDIDATE.document.name}
                    </p>
                    <p className="font-body text-[10px] text-gray-400">
                      {FEATURED_CANDIDATE.document.size}
                    </p>
                  </div>
                  <Download size={13} className="text-gray-400 group-hover:text-[#4A7FA7] transition-colors ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Metrics row */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-[#4A7FA7]" />
                <span className="font-body text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  Teaching Hours
                </span>
              </div>
              <span className="font-heading text-lg font-extrabold text-[#0A1931]">
                {FEATURED_CANDIDATE.teachingHours}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <Award size={14} className="text-[#4A7FA7]" />
                <span className="font-body text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  Publications
                </span>
              </div>
              <span className="font-heading text-lg font-extrabold text-[#0A1931]">
                {FEATURED_CANDIDATE.publications}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => !actionDone && setConfirmModal("approve")}
              disabled={actionDone}
              className={`flex items-center gap-2 font-body text-sm font-bold px-5 py-2.5 rounded-xl
                transition-colors shadow-sm ${
                actionDone
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#0A1931] hover:bg-[#1A3D63] text-white"
              }`}
            >
              <CheckCircle2 size={15} />
              Approve Candidate
            </button>
            <button
              onClick={() => !actionDone && setConfirmModal("reject")}
              disabled={actionDone}
              className={`flex items-center gap-2 font-body text-sm font-bold px-5 py-2.5 rounded-xl
                border transition-colors ${
                actionDone
                  ? "border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500"
              }`}
            >
              <XCircle size={15} />
              Reject
            </button>
          </div>
        </div>

        {/* ── AI Recommended Match ── */}
        <div className="bg-gradient-to-b from-[#0A1931] to-[#1A3D63] rounded-2xl p-6 text-white
          shadow-md flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 relative z-10">
            <Sparkles size={15} className="text-amber-300" />
            <h3 className="font-heading text-sm font-bold text-white">AI-Recommended Match</h3>
          </div>

          <p className="font-body text-xs text-[#B3CFE5] leading-relaxed relative z-10">
            We've identified a high-priority match for our new Neuroscience research track.
          </p>

          {/* Match card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 relative z-10 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${AI_MATCH.avatarBg} border-2 border-white/20
                flex items-center justify-center flex-shrink-0`}>
                <span className="font-heading text-sm font-extrabold text-white">{AI_MATCH.avatar}</span>
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-white">{AI_MATCH.name}</p>
                <p className="font-body text-[10px] text-[#B3CFE5]">{AI_MATCH.field}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                <p className="font-body text-[9px] uppercase tracking-wider text-[#B3CFE5] font-semibold">
                  Fit Score
                </p>
                <p className="font-heading text-lg font-extrabold text-white mt-0.5">
                  {AI_MATCH.fitScore}%
                </p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2 text-center">
                <p className="font-body text-[9px] uppercase tracking-wider text-[#B3CFE5] font-semibold">
                  Urgency
                </p>
                <p className="font-heading text-base font-extrabold text-amber-300 mt-0.5">
                  {AI_MATCH.urgency}
                </p>
              </div>
            </div>

            <button className="w-full border border-white/30 hover:bg-white/10 text-white font-body
              text-xs font-bold py-2 rounded-lg transition-colors uppercase tracking-wide">
              View Special Case
            </button>
          </div>

          {/* Credentials */}
          <div className="relative z-10 space-y-2">
            {AI_MATCH.credentials.map(c => (
              <div key={c} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#4A7FA7] mt-1.5 flex-shrink-0" />
                <p className="font-body text-xs text-[#B3CFE5]">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Other Pending Applicants ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-heading text-base font-bold text-[#0A1931]">
            Other Pending Applicants
          </h3>
          <span className="font-body text-[10px] font-bold px-2.5 py-1 rounded-lg
            bg-gray-100 text-gray-500 uppercase tracking-wide">
            12 Total
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {OTHER_APPLICANTS.map(ap => (
            <div key={ap.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${ap.avatarBg} text-white text-xs
                  font-bold font-heading flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {ap.avatar}
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-[#0A1931]">{ap.name}</p>
                  <p className="font-body text-xs text-gray-400 mt-0.5">
                    Applied {ap.time} · {ap.field}
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 font-body text-xs font-semibold
                text-[#4A7FA7] hover:text-[#1A3D63] transition-colors opacity-0 group-hover:opacity-100">
                Review <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-50 flex justify-center">
          <button className="font-body text-sm font-bold text-[#4A7FA7] hover:text-[#1A3D63]
            transition-colors uppercase tracking-wide flex items-center gap-1.5">
            View All Applications <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Warning Notice ── */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
        <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm font-semibold text-amber-700">
            14 applications have been waiting for more than 7 days.
          </p>
          <p className="font-body text-xs text-amber-600 mt-0.5">
            Delayed reviews may impact mentor onboarding timelines for the next cohort.
          </p>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          action={confirmModal}
          name={FEATURED_CANDIDATE.name}
          onConfirm={handleConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </div>
  )
}
