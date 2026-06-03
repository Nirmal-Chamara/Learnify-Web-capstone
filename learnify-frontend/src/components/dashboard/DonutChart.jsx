import { useEffect, useRef } from "react";

// ── shared Chart.js loader ───────────────────────────────────────
function loadChartJs(cb) {
  if (window.Chart) { cb(window.Chart); return; }
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
  s.onload = () => cb(window.Chart);
  document.head.appendChild(s);
}

// ── DonutChart ───────────────────────────────────────────────────
const DONUT_DATA = [
  { label: "Data Struct.", value: 28, color: "#4A7FA7" },
  { label: "Calculus",     value: 18, color: "#1A3D63" },
  { label: "Databases",    value: 22, color: "#7aadcc" },
  { label: "Soft. Eng.",   value: 14, color: "#a8cbea" },
  { label: "Networks",     value: 18, color: "#B3CFE5" },
];

export function DonutChart({ data = DONUT_DATA }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    loadChartJs((Chart) => {
      if (!canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels: data.map((d) => d.label),
          datasets: [{
            data:            data.map((d) => d.value),
            backgroundColor: data.map((d) => d.color),
            borderColor:     "#ffffff",
            borderWidth:     3,
            hoverOffset:     7,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#fff",
              borderColor: "#D0E3F0",
              borderWidth: 1,
              titleColor: "#0A1931",
              bodyColor: "#4A6880",
              padding: 10,
              callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` },
            },
          },
        },
      });
    });
    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div className="h-full bg-white rounded-[18px] border border-[#D0E3F0] overflow-hidden shadow-[0_2px_8px_rgba(10,25,49,0.07)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#D0E3F0]">
        <div className="text-[15px] font-bold text-[#0A1931]" style={{ fontFamily: "Poppins, sans-serif" }}>
          Time Allocation
        </div>
        <div className="text-[12px] text-[#8AAABF] mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
          By subject — this month
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 py-5">
        <div style={{ height: 175 }}>
          <canvas ref={canvasRef} />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: d.color }} />
              <span className="text-[12px] text-[#4A6880]" style={{ fontFamily: "Inter, sans-serif" }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SubjectProgress ──────────────────────────────────────────────
const BAR_COLORS = {
  green: { text: "#1a8a4a", gradient: "linear-gradient(90deg,#1a8a4a,#5dd87a)" },
  amber: { text: "#b86a00", gradient: "linear-gradient(90deg,#b86a00,#f0b94a)" },
  blue:  { text: "#4A7FA7", gradient: "linear-gradient(90deg,#4A7FA7,#B3CFE5)" },
  red:   { text: "#c0392b", gradient: "linear-gradient(90deg,#c0392b,#ff7b7b)" },
};

const SUBJECTS = [
  { name: "Data Structures",     pct: 88, color: "green" },
  { name: "Calculus III",        pct: 62, color: "amber" },
  { name: "Database Systems",    pct: 79, color: "blue"  },
  { name: "Software Engineering",pct: 45, color: "red"   },
  { name: "Computer Networks",   pct: 91, color: "green" },
  { name: "Operating Systems",   pct: 55, color: "amber" },
];

export function SubjectProgress({ subjects = SUBJECTS }) {
  return (
    <div className="h-full bg-white rounded-[18px] border border-[#D0E3F0] overflow-hidden shadow-[0_2px_8px_rgba(10,25,49,0.07)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#D0E3F0]">
        <div>
          <div className="text-[15px] font-bold text-[#0A1931]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Subject Progress
          </div>
          <div className="text-[12px] text-[#8AAABF] mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
            Completion by module
          </div>
        </div>
        <button className="text-[12px] font-semibold text-[#4A7FA7] bg-[#deeef8] px-3 py-1.5 rounded-[7px] hover:bg-[#cce3f3] transition-colors cursor-pointer border-none">
          Details
        </button>
      </div>

      {/* Bars */}
      <div className="px-6 py-5 flex flex-col gap-4">
        {subjects.map((s) => {
          const c = BAR_COLORS[s.color];
          return (
            <div key={s.name}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-[#0A1931]" style={{ fontFamily: "Inter, sans-serif" }}>
                  {s.name}
                </span>
                <span className="text-[13px] font-bold" style={{ color: c.text, fontFamily: "Poppins, sans-serif" }}>
                  {s.pct}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-[#E4EEF7]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.pct}%`, background: c.gradient, transition: "width 0.8s ease" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Default export
export default DonutChart;
