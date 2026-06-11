import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Send, Flame, Zap, Target, Clock } from "lucide-react"
import Button from "../components/common/Button"
import LoadingSpinner from "../components/common/LoadingSpinner"
import ErrorMessage from "../components/common/ErrorMessage"
import { useAuth } from "../hooks/useAuth"
import { getDashboardStats } from "../api/dashboardApi"

// ── Helper — build calendar for current month ─────────────
function buildCalendar(deadlines) {
  const now       = new Date()
  const year      = now.getFullYear()
  const month     = now.getMonth()
  const today     = now.getDate()
  const monthName = now.toLocaleString("default", { month: "long" })

  const deadlineDates = new Set(
    deadlines.map(d => new Date(d.due_date).getDate())
  )

  const firstDay = new Date(year, month, 1).getDay()
  const adjusted = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dates = []
  let   week  = Array(adjusted).fill(null)

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d)
    if (week.length === 7) {
      dates.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    dates.push(week)
  }

  return { monthName, today, deadlineDates, dates }
}

// ── Circular progress ring ────────────────────────────────
function RingProgress({ pct = 0, size = 64, stroke = 6, color = "#4A7FA7" }) {
  const r       = (size - stroke) / 2
  const circ    = 2 * Math.PI * r
  const dash    = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#E8F0F7" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }} />
    </svg>
  )
}

export default function DashboardPage() {
  const { user }              = useAuth()
  const [message, setMessage] = useState("")

  // ── State ──────────────────────────────────────────────
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [stats, setStats]       = useState({
    subjects: 0, tasks_today: 0, completed: 0
  })
  const [analytics, setAnalytics] = useState({
    study_streak_days: 0,
    focus_score:       0,
    semester_goal_pct: 0,
    total_study_hours: 0,
  })
  const [weeklyData, setWeeklyData]       = useState([])
  const [deadlines, setDeadlines]         = useState([])
  const [scheduledSubjects, setScheduled] = useState([])

  // ── Fetch dashboard data ───────────────────────────────
  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true)
        const response = await getDashboardStats()
        const data     = response.data
        setStats(data.stats)
        setAnalytics(data.analytics || {
          study_streak_days: 0,
          focus_score:       0,
          semester_goal_pct: 0,
          total_study_hours: 0,
        })
        setWeeklyData(data.weekly_chart)
        setDeadlines(data.deadlines)
        setScheduled(data.scheduled_subjects)
      } catch (err) {
        setError("Failed to load dashboard data.")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // ── Build stats cards ──────────────────────────────────
  const statsData = [
    { label: "Subjects",    value: String(stats.subjects).padStart(2, "0")    },
    { label: "Tasks Today", value: String(stats.tasks_today).padStart(2, "0") },
    { label: "Completed",   value: String(stats.completed).padStart(2, "0")   },
  ]

  // ── Analytics cards config ─────────────────────────────
  const analyticsCards = [
    {
      id:      "streak",
      label:   "Study Streak",
      value:   analytics.study_streak_days,
      unit:    analytics.study_streak_days === 1 ? "day" : "days",
      icon:    Flame,
      color:   "#F97316",
      bg:      "from-orange-50 to-orange-100/60",
      ring:    null,           // no ring — show fire icon + big number
    },
    {
      id:      "focus",
      label:   "Focus Score",
      value:   analytics.focus_score,
      unit:    "%",
      icon:    Zap,
      color:   "#4A7FA7",
      bg:      "from-blue-50 to-blue-100/60",
      ring:    analytics.focus_score,
    },
    {
      id:      "goal",
      label:   "Semester Goal",
      value:   analytics.semester_goal_pct,
      unit:    "%",
      icon:    Target,
      color:   "#10B981",
      bg:      "from-emerald-50 to-emerald-100/60",
      ring:    analytics.semester_goal_pct,
    },
    {
      id:      "hours",
      label:   "Total Study Hours",
      value:   analytics.total_study_hours,
      unit:    "hrs",
      icon:    Clock,
      color:   "#7C5CBF",
      bg:      "from-purple-50 to-purple-100/60",
      ring:    null,
    },
  ]

  // ── Calendar ───────────────────────────────────────────
  const { monthName, today, deadlineDates, dates } = buildCalendar(deadlines)
  const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const firstName = user?.name?.split(" ")[0] || "there"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" label="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Error */}
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError("")} />
      )}

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-[#1A3D63] to-[#4A7FA7]
              rounded-2xl px-6 py-8 text-center shadow-lg"
          >
            <p className="font-body text-xs text-[#B3CFE5] tracking-widest
              uppercase mb-3">
              {stat.label}
            </p>
            <p className="font-heading text-5xl font-bold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Analytics Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              className={`bg-gradient-to-br ${card.bg} rounded-2xl p-4
                shadow-md border border-white/60 flex flex-col gap-3
                hover:shadow-lg transition-shadow duration-200`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="font-body text-xs font-semibold text-gray-500
                  uppercase tracking-wide">
                  {card.label}
                </p>
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <Icon size={14} style={{ color: card.color }} />
                </span>
              </div>

              {/* Value + optional ring */}
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className="font-heading text-3xl font-bold"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </span>
                  <span className="font-body text-xs text-gray-400 ml-1">
                    {card.unit}
                  </span>
                </div>

                {card.ring !== null && (
                  <div className="relative flex items-center justify-center">
                    <RingProgress
                      pct={Math.min(card.ring, 100)}
                      size={52}
                      stroke={5}
                      color={card.color}
                    />
                    <span
                      className="absolute font-body text-[10px] font-bold"
                      style={{ color: card.color, transform: "none" }}
                    >
                      {Math.round(card.ring)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Streak flame bar — only for streak */}
              {card.id === "streak" && (
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i < Math.min(analytics.study_streak_days, 7)
                            ? card.color
                            : "#FED7AA",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Weekly Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl
          border border-white/5">
          <h3 className="font-heading text-sm font-semibold text-[#1A3D63] mb-4">
            Weekly Progress
          </h3>

          {weeklyData.every(d => d.value === 0) ? (
            <div className="flex items-center justify-center h-48">
              <p className="font-body text-sm text-gray-400">
                No study sessions recorded this week
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData} barSize={35}
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#1A3D63", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#1A3D63", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#4A7FA7",
                    border: "1px solid #5a93c0",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(74,127,167,0.1)" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.value === Math.max(...weeklyData.map(d => d.value))
                        ? "#4A7FA7" : "#1A3D63"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* Deadlines Calendar */}
          <div className="bg-white rounded-2xl p-4 shadow-lg
            border border-white/5">
            <h3 className="font-heading text-sm font-semibold
              text-[#1A3D63] mb-3">
              Deadlines
            </h3>
            <p className="font-body text-xs text-[#1A3D63]
              text-center mb-2">
              {monthName}
            </p>

            <div className="grid grid-cols-7 mb-1">
              {calendarDays.map((day) => (
                <div key={day}
                  className="font-body text-[10px] text-[#1A3D63]
                    text-center py-1 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {dates.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {week.map((date, di) => (
                  <div
                    key={di}
                    className={`font-body text-[11px] text-center
                      w-6 h-6 mx-auto my-0.5 flex items-center
                      justify-center rounded-full
                      ${!date ? "" :
                        date === today
                          ? "bg-red-500 text-white font-bold"
                          : deadlineDates.has(date)
                          ? "bg-yellow-400 text-white font-bold"
                          : "text-[#4A6880] hover:bg-[#1A3D63] hover:text-white cursor-pointer"
                      }`}
                  >
                    {date || ""}
                  </div>
                ))}
              </div>
            ))}

            <div className="flex items-center gap-3 mt-3 pt-2
              border-t border-gray-100">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-body text-[10px] text-gray-400">Today</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="font-body text-[10px] text-gray-400">Deadline</span>
              </div>
            </div>
          </div>

          {/* Scheduled Subjects */}
          <div className="bg-white rounded-2xl p-4 shadow-lg
            border border-white/5">
            <h3 className="font-heading text-sm font-semibold
              text-[#1A3D63] mb-3">
              Scheduled Subjects
            </h3>

            {scheduledSubjects.length === 0 ? (
              <p className="font-body text-xs text-gray-400
                text-center py-3">
                No subjects enrolled yet
              </p>
            ) : (
              <div className="space-y-3">
                {scheduledSubjects.map((subject, i) => (
                  <div key={i}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: subject.color_hex || "#4A7FA7" }}
                      />
                      <span className="font-body text-sm text-[#1A3D63]">
                        {subject.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="font-body text-xs text-[#B3CFE5]
              hover:text-[#1A3D63] mt-4 w-full text-center
              transition-colors duration-200 font-medium">
              See More
            </button>
          </div>

        </div>
      </div>

      {/* ── AI Assistant ── */}
      <div className="bg-white rounded-2xl p-6 shadow-lg
        border border-white/5">
        <h3 className="font-heading text-sm font-semibold
          text-[#1A3D63] mb-4">
          Your personal AI study assistant
        </h3>
        <div className="text-center mb-6">
          <p className="font-body text-sm text-[#1A3D63]">
            Hi {firstName},
          </p>
          <p className="font-body text-sm text-[#1A3D63]">
            What is on your mind?
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-xl
          px-4 py-3 border border-[#4A7FA7]/30">
          <input
            type="text"
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent text-[#0A1931]
              placeholder-[#1A3D63]/30 font-body text-sm
              focus:outline-none"
          />
          <Button variant="ghost" icon={Send} size="sm" />
        </div>
      </div>

    </div>
  )
}