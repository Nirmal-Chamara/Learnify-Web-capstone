import { useState } from "react"
import {
  Activity, Download, RefreshCw, Server, HardDrive,
  Wifi, AlertTriangle, ExternalLink
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts"

// ── Static mock data ──

const activeUsersData = [
  { time: "00:00", users: 130 },
  { time: "03:00", users: 75 },
  { time: "06:00", users: 55 },
  { time: "09:00", users: 210 },
  { time: "12:00", users: 370 },
  { time: "15:00", users: 430 },
  { time: "18:00", users: 510 },
  { time: "21:00", users: 470 },
  { time: "Now",   users: 540 },
]

const apiRequestData = [
  { value: 34 },
  { value: 52 },
  { value: 68 },
  { value: 45 },
  { value: 60 },
  { value: 78 },
  { value: 43 },
  { value: 88 },
  { value: 110 },
]

const systemEvents = [
  {
    dotColor: "bg-red-500",
    title: "Database Connection Timeout",
    desc: "DB-Cluster-01 reported abnormal latency spikes.",
    time: "2 MINUTES AGO",
    isAlert: true,
    hasLink: true,
  },
  {
    dotColor: "bg-blue-500",
    title: "New Deployment: v2.4.1-stable",
    desc: "Automated CI/CD pipeline completed successfully.",
    time: "18 MINUTES AGO",
    isAlert: false,
    hasLink: true,
  },
  {
    dotColor: "bg-green-500",
    title: "SSL Certificate Renewed",
    desc: "Certificate for domain learnify.edu extended to 2025.",
    time: "1 HOUR AGO",
    isAlert: false,
    hasLink: false,
  },
]

const bottomMetrics = [
  {
    icon: HardDrive,
    iconBg: "bg-blue-50 text-blue-600",
    value: "4.2 TB",
    label: "STORAGE UTILIZED",
    badge: "+2.4%",
    badgeColor: "text-green-600",
  },
  {
    icon: Server,
    iconBg: "bg-teal-50 text-teal-600",
    value: "12.8 GB",
    label: "RAM CONSUMPTION",
    badge: "Stable",
    badgeColor: "text-gray-400",
  },
  {
    icon: Wifi,
    iconBg: "bg-green-50 text-green-600",
    value: "124 ms",
    label: "NETWORK LATENCY",
    badge: "Healthy",
    badgeColor: "text-green-600",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-red-50 text-red-600",
    value: "3 Nodes",
    label: "DEGRADED INSTANCES",
    badge: "Critical",
    badgeColor: "text-red-600",
  },
]

// ── Chart tooltips ──

function AreaTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg text-xs font-body">
        <p className="font-bold text-[#0A1931]">{label}</p>
        <p className="text-[#4A7FA7]">{payload[0].value} users</p>
      </div>
    )
  }
  return null
}

function BarTooltip({ active, payload }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg text-xs font-body">
        <p className="font-bold text-[#0A1931]">{payload[0].value} req/s</p>
      </div>
    )
  }
  return null
}

// ── SVG circular gauge ──

function CpuGauge({ percent }) {
  const r    = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#F1F5F9" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke="#0A1931"
        strokeWidth="12"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
      />
      <text
        x="70" y="65"
        textAnchor="middle"
        style={{ fontSize: 22, fontWeight: 800, fill: "#0A1931", fontFamily: "inherit" }}
      >
        {percent}%
      </text>
      <text
        x="70" y="83"
        textAnchor="middle"
        style={{ fontSize: 9, fill: "#94A3B8", fontWeight: 600, letterSpacing: 1, fontFamily: "inherit" }}
      >
        OPERATIONAL
      </text>
    </svg>
  )
}

// ── Page ──

export default function AdminSystemMonitoringPage() {
  const [activeBar, setActiveBar] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 800)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-[#0A1931]">

      {/* ── Header ── */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-body text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Live Infrastructure
          </span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-[#0A1931]">System Monitoring</h1>
            <p className="font-body text-sm text-gray-400 mt-1">
              Real-time health overview and performance telemetry across all nodes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200
              font-body text-xs font-semibold text-[#0A1931] hover:bg-gray-50 transition-colors">
              <Download size={14} />
              Export Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A1931] text-white
                font-body text-xs font-semibold hover:bg-[#1A3D63] transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh Interval: 5s
            </button>
          </div>
        </div>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─ Left: Charts ─ */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Active Users */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-heading text-base font-bold text-[#0A1931]">Active Users</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-body text-xs text-gray-400 font-semibold">Live Traffic</span>
              </div>
            </div>
            <p className="font-body text-xs text-gray-400 mb-5">Concurrency over last 24 hours</p>

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={activeUsersData} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0A1931" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#0A1931" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 600 }}
                />
                <YAxis hide />
                <Tooltip content={<AreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0A1931"
                  strokeWidth={2.5}
                  fill="url(#userGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#4A7FA7", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* API Request Volume */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-base font-bold text-[#0A1931]">API Request Volume</h2>
              <span className="font-body text-xs text-gray-400 font-semibold">Requests/sec</span>
            </div>

            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={apiRequestData}
                barCategoryGap="25%"
                onMouseLeave={() => setActiveBar(null)}
              >
                <XAxis hide />
                <YAxis hide />
                <Tooltip content={<BarTooltip />} cursor={false} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={(_, index) => setActiveBar(index)}
                >
                  {apiRequestData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        index === apiRequestData.length - 1 || activeBar === index
                          ? "#0A1931"
                          : "#B3CFE5"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="flex justify-between font-body text-[10px] text-gray-400 mt-2 px-1">
              <span>10m ago</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        {/* ─ Right: CPU + Events ─ */}
        <div className="flex flex-col gap-6">

          {/* CPU Usage */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading text-base font-bold text-[#0A1931] mb-5">CPU Usage</h2>

            <div className="flex justify-center">
              <CpuGauge percent={72} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-50">
              <div className="text-center">
                <p className="font-body text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Peak</p>
                <p className="font-heading text-xl font-extrabold text-[#0A1931] mt-1">94%</p>
              </div>
              <div className="text-center">
                <p className="font-body text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Avg</p>
                <p className="font-heading text-xl font-extrabold text-[#0A1931] mt-1">68%</p>
              </div>
            </div>
          </div>

          {/* System Events */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
            <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-4">
              <h2 className="font-heading text-sm font-bold text-[#0A1931]">System Events</h2>
              <button className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center
                text-gray-400 hover:text-[#4A7FA7] hover:border-[#4A7FA7] transition-colors">
                <Activity size={13} />
              </button>
            </div>

            <div className="space-y-4">
              {systemEvents.map((ev, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${ev.dotColor}`} />
                    {i < systemEvents.length - 1 && (
                      <span className="w-px h-6 bg-gray-100" />
                    )}
                  </div>
                  <div className="min-w-0 -mt-0.5 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`font-body text-xs font-semibold leading-snug ${
                        ev.isAlert ? "text-red-600" : "text-[#0A1931]"
                      }`}>
                        {ev.title}
                      </p>
                      {ev.hasLink && (
                        <ExternalLink size={11} className="text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="font-body text-[10px] text-gray-400 mt-0.5 leading-relaxed">{ev.desc}</p>
                    <p className="font-body text-[9px] text-gray-300 mt-1 uppercase tracking-wide font-semibold">
                      {ev.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full border border-gray-200 text-[#0A1931] font-body text-xs font-bold
              py-2.5 rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-wider">
              View Audit Logs
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Metrics Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {bottomMetrics.map((m) => {
          const Icon = m.icon
          return (
            <div
              key={m.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${m.iconBg}`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-heading text-xl font-extrabold text-[#0A1931]">
                    {m.value}
                  </span>
                  <span className={`font-body text-[10px] font-bold ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
                <p className="font-body text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                  {m.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
