// src/components/dashboard/StatsCard.jsx
// Reusable stat card.  Two visual variants:
//   variant="highlight"  → dark navy gradient (Overall Progress with ring)
//   variant="default"    → white card with coloured icon
//
// Props:
//   variant     – "highlight" | "default"
//   label       – string   top label text
//   value       – string   big number/text
//   valueSuffix – string   small superscript after value  e.g. "hrs" | "/56" | "days"
//   delta       – string   bottom delta text
//   deltaType   – "up" | "neutral"
//   iconColor   – "blue" | "green" | "amber" | "white"
//   icon        – JSX      svg icon element
//   // Only for variant="highlight":
//   ringPct     – number   0-100 for the circular progress ring
//   ringLabel   – string   label under percentage in ring

const ICON_BG = {
  blue:  "bg-[#deeef8] text-[#4A7FA7]",
  green: "bg-[#e6f7ed] text-[#1a8a4a]",
  amber: "bg-[#fff3e0] text-[#b86a00]",
  white: "bg-white/20 text-white",
};

const DELTA_COLOR = {
  up:      "text-[#1a8a4a]",
  neutral: "text-[#8AAABF]",
};

// SVG ring — circumference of r=23 circle = 144.51
function Ring({ pct = 75 }) {
  const C = 144.51;
  const offset = C - (C * pct) / 100;
  return (
    <svg width="60" height="60" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="23" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
      <circle
        cx="28" cy="28" r="23"
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="5"
        strokeDasharray={C}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#B3CFE5" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function StatsCard({
  variant     = "default",
  label       = "Label",
  value       = "—",
  valueSuffix = "",
  delta       = "",
  deltaType   = "up",
  iconColor   = "blue",
  icon        = null,
  ringPct     = 75,
  ringLabel   = "Semester Goal",
}) {
  const isHighlight = variant === "highlight";

  return (
    <div
      className={`
        rounded-[18px] p-5 relative overflow-hidden
        border transition-all duration-200 hover:-translate-y-1
        ${isHighlight
          ? "border-transparent text-white"
          : "bg-white border-[#D0E3F0] shadow-[0_2px_8px_rgba(10,25,49,0.07)] hover:shadow-[0_4px_20px_rgba(10,25,49,0.10)]"
        }
      `}
      style={
        isHighlight
          ? {
              background: "linear-gradient(135deg, #0A1931 0%, #1A3D63 60%, #4A7FA7 100%)",
              boxShadow: "0 4px 20px rgba(10,25,49,0.18)",
            }
          : {}
      }
    >
      {/* ── Top row: label + icon ── */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`text-[12px] font-semibold tracking-[0.3px] ${isHighlight ? "text-white/65" : "text-[#8AAABF]"}`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {label}
        </span>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ICON_BG[iconColor]}`}>
            {icon}
          </div>
        )}
      </div>

      {/* ── Value area ── */}
      {isHighlight ? (
        /* Ring + percentage for highlight card */
        <div className="flex items-center gap-3 mt-1">
          <Ring pct={ringPct} />
          <div>
            <div
              className="text-[22px] font-extrabold text-white leading-none"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {ringPct}%
            </div>
            <div className="text-[11px] text-white/55 mt-0.5">{ringLabel}</div>
          </div>
        </div>
      ) : (
        <div
          className="text-[32px] font-extrabold leading-none text-[#0A1931]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {value}
          {valueSuffix && (
            <sup
              className="text-[14px] font-semibold align-super"
              style={{ color: valueSuffix.startsWith("/") ? "#8AAABF" : "#4A7FA7" }}
            >
              {valueSuffix}
            </sup>
          )}
        </div>
      )}

      {/* ── Delta ── */}
      {delta && (
        <div
          className={`text-[12px] font-semibold mt-2 flex items-center gap-1 ${
            isHighlight ? "text-white/70" : DELTA_COLOR[deltaType]
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
