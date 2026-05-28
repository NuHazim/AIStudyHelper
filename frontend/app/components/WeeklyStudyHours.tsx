"use client"
import { useEffect, useRef } from "react"
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, type ChartOptions } from "chart.js"
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type Props = {
  /** Hours studied per day, index 0 = Mon … 6 = Sun */
  hours?: number[]
  /** Index of today (0=Mon … 6=Sun). Highlights that bar in cyan-purple. */
  todayIndex?: number
}

export default function WeeklyStudyHours({
  hours = [3.5, 5, 2, 6.5, 5.5, 0.5, 0.8],
  todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Destroy previous instance on re-render
    chartRef.current?.destroy()

    // Build per-bar gradients
    const gradients = DAYS.map((_, i) => {
      const g = ctx.createLinearGradient(0, 0, 0, 220)
      if (i === todayIndex) {
        g.addColorStop(0, "#67e8f9")  // cyan top
        g.addColorStop(1, "#a78bfa")  // purple bottom
      } else {
        g.addColorStop(0, "#818cf8")  // indigo top
        g.addColorStop(1, "#6d28d9")  // deep purple bottom
      }
      return g
    })

    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e2040",
          titleColor: "#a5b4fc",
          bodyColor: "#e2e8f0",
          borderColor: "rgba(167,139,250,0.3)",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => ` ${Number(ctx.parsed.y).toFixed(1)} hrs`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: (c) => (c.index === todayIndex ? "#67e8f9" : "#4e5070"),
            font: { family: "'Syne', sans-serif", size: 12 },
            autoSkip: false,
          },
        },
        y: {
          display: false,
          min: 0,
          max: Math.max(...hours) * 1.2,
        },
      },
      animation: { duration: 800, easing: "easeOutQuart" },
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: DAYS,
        datasets: [{
          data: hours,
          backgroundColor: gradients,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.72,
          categoryPercentage: 0.82,
        }],
      },
      options,
    })

    return () => { chartRef.current?.destroy() }
  }, [hours, todayIndex])

  return (
    <div
      className="rounded-2xl p-7"
      style={{ background: "#050510", fontFamily: "'Syne', sans-serif" }}
    >
      <p className="text-white text-[17px] font-bold mb-1">Weekly Study Hours</p>
      <p className="text-[#4e5070] text-[13px] mb-6">This week</p>

      <div className="relative w-full" style={{ height: 120 }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Bar chart of weekly study hours"
        />
      </div>
    </div>
  )
}