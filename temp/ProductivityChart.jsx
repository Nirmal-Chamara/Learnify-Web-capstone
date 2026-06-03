// src/components/dashboard/ProductivityChart.jsx
// Line + area chart — "Weekly Study Activity" panel.
// Uses Chart.js loaded from CDN (no npm install needed).
// Props:
//   title    – string
//   subtitle – string
//   data     – array of { label, hours } objects
//   target   – number  dashed target line value

import { useEffect, useRef } from "react";

const DEFAULT_DATA = [
  { label: "Apr 1",  hours: 2.5 },
  { label: "Apr 3",  hours: 4   },
  { label: "Apr 5",  hours: 3   },
  { label: "Apr 7",  hours: 5   },
  { label: "Apr 9",  hours: 4.5 },
  { label: "Apr 11", hours: 6   },
  { label: "Apr 13", hours: 3.5 },
  { label: "Apr 15", hours: 5.5 },
  { label: "Apr 17", hours: 4   },
  { label: "Apr 19", hours: 5   },
];

function loadChartJs(cb) {
  if (window.Chart) { cb(window.Chart); return; }
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
  s.onload = () => cb(window.Chart);
  document.head.appendChild(s);
}

export default function ProductivityChart({
  title    = "Weekly Study Activity",
  subtitle = "Hours studied per day — April 2025",
  data     = DEFAULT_DATA,
  target   = 4,
}) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    loadChartJs((Chart) => {
      if (!canvasRef.current) return;
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Study Hours",
              data: data.map((d) => d.hours),
              borderColor: "#4A7FA7",
              backgroundColor: "rgba(74,127,167,0.07)",
              borderWidth: 2.5,
              pointBackgroundColor: "#ffffff",
              pointBorderColor: "#4A7FA7",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Target",
              data: data.map(() => target),
              borderColor: "rgba(74,127,167,0.28)",
              borderWidth: 1.5,
              borderDash: [6, 4],
              pointRadius: 0,
              tension: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#fff",
              borderColor: "#D0E3F0",
              borderWidth: 1,
              titleColor: "#0A1931",
              bodyColor: "#4A6880",
              titleFont: { family: "Poppins", weight: "700", size: 12 },
              bodyFont:  { family: "Inter",   size: 12 },
              padding: 10,
              boxPadding: 4,
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(208,227,240,0.7)" },
              ticks: { color: "#8AAABF", font: { size: 11, family: "Inter" } },
            },
            y: {
              grid: { color: "rgba(208,227,240,0.7)" },
              ticks: { color: "#8AAABF", font: { size: 11, family: "Inter" } },
              min: 0,
              max: 8,
            },
          },
        },
      });
    });

    return () => chartRef.current?.destroy();
  }, [data, target]);

  return (
    <div className="bg-white rounded-[18px] border border-[#D0E3F0] overflow-hidden shadow-[0_2px_8px_rgba(10,25,49,0.07)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#D0E3F0]">
        <div>
          <div
            className="text-[15px] font-bold text-[#0A1931]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {title}
          </div>
          <div className="text-[12px] text-[#8AAABF] mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>
            {subtitle}
          </div>
        </div>
        <button
          className="text-[12px] font-semibold text-[#4A7FA7] bg-[#deeef8] px-3 py-1.5 rounded-[7px] hover:bg-[#cce3f3] transition-colors border-none cursor-pointer"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Export CSV
        </button>
      </div>

      {/* Chart */}
      <div className="px-6 py-5" style={{ height: 260 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
