const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

type DayEntry = { date: Date; hrs: number }

function getLevel(h: number): 0 | 1 | 2 | 3 | 4 {
  if (h === 0) return 0
  if (h < 1)  return 1
  if (h < 3)  return 2
  if (h < 6)  return 3
  return 4
}

// Level 0 → deepest bg, Level 4 → brightest brand color
// Uses your palette: #050510 #0a0a2e #1a1a5e #4a4ae8 #a5a5ff
// Level 1 = #12124a (slight step between l0 and l2, stays on-brand)
const CELL_CLASSES: Record<number, string> = {
  0: "bg-[#0a0a2e] border border-[rgba(165,165,255,0.07)]",
  1: "bg-[#12124a] border border-[rgba(165,165,255,0.1)]",
  2: "bg-[#1a1a5e]",
  3: "bg-[#4a4ae8]",
  4: "bg-[#a5a5ff] shadow-[0_0_7px_rgba(165,165,255,0.5)]",
}

const RAW_HOURS = [
  // Jan — motivated start, tapers
  0,2,3,4,2,0,0, 3,4,5,3,2,0,0, 2,1,3,4,1,0,0, 3,5,6,4,3,0,0, 3,2,
  // Feb — mid-semester grind
  0,4,5,3,4,0,0, 6,7,5,4,3,0,0, 2,1,0,3,4,0,0, 5,6,8,5,4,0,0,
  // Mar — spring break mixed
  0,3,4,2,0,0,0, 1,2,3,2,1,0,0, 4,5,6,4,3,0,0, 2,1,0,0,1,0,0, 3,
  // Apr — exam month, spikes
  0,5,7,8,6,4,0, 2,6,8,9,7,0,0, 5,8,10,9,6,0,0, 3,4,5,3,2,0,0, 1,
  // May — semester ends, chill
  0,1,0,0,2,1,0, 0,0,1,2,0,0,0, 1,2,1,0,0,0,0, 0,1,2,1,0,0,0, 0,0,0,
  // Jun — summer light
  0,0,1,2,1,0,0, 2,3,2,1,0,0,0, 0,1,2,1,0,0,0, 1,0,2,3,1,0,0,
  // Jul — mostly off
  0,0,0,1,0,0,0, 0,1,2,1,0,0,0, 0,0,0,1,1,0,0, 2,1,0,0,0,0,0, 0,1,0,
  // Aug — new semester prep
  0,2,3,2,1,0,0, 3,4,3,2,1,0,0, 2,3,4,3,2,0,0, 4,5,4,3,0,0,0, 2,
  // Sep — full semester
  0,4,5,3,4,2,0, 3,5,6,4,3,0,0, 5,6,7,5,4,0,0, 3,4,5,3,2,0,0,
  // Oct — consistent grind
  0,4,5,4,3,2,0, 5,6,5,4,3,0,0, 4,5,6,4,3,0,0, 5,7,8,6,4,0,0, 3,
  // Nov — finals incoming, streaks
  0,5,7,8,6,3,0, 6,8,9,7,5,0,0, 4,6,8,9,6,0,0, 7,9,10,8,5,0,0,
  // Dec — post-finals crash
  0,2,1,0,0,0,0, 0,1,2,1,0,0,0, 0,0,0,1,0,0,0, 0,1,0,0,0,0,0, 0,0,0,0,0,0,0,
]

function buildData(): DayEntry[] {
  return RAW_HOURS.slice(0, 365).map((hrs, i) => {
    const date = new Date(2025, 0, 1)
    date.setDate(date.getDate() + i)
    return { date, hrs }
  })
}

export default function StudyHeatmapDemo() {
  const data = buildData()
  const startDow = data[0].date.getDay()
  const weeksNeeded = Math.ceil((startDow + data.length) / 7)

  type MonthPos = { month: number; week: number }
  const monthPositions: MonthPos[] = []
  let lastMonth = -1
  for (let w = 0; w < weeksNeeded; w++) {
    const di = w * 7 - startDow
    if (di >= 0 && di < data.length) {
      const m = data[di].date.getMonth()
      if (m !== lastMonth) { monthPositions.push({ month: m, week: w }); lastMonth = m }
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{ background: "#050510", border: "1px solid rgba(165,165,255,0.12)" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-60 h-60 rounded-full"
        style={{ background: "radial-gradient(circle,rgba(74,74,232,0.1) 0%,transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-48 h-48 rounded-full"
        style={{ background: "radial-gradient(circle,rgba(165,165,255,0.06) 0%,transparent 70%)" }} />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
        <div>
          <p className="text-[16px] font-bold tracking-wide text-[#e8e8ff] mb-1"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Study Heatmap
          </p>
          <p className="text-[10px] font-mono text-[#3a3a7a] uppercase tracking-widest">
            Daily hours logged · 2025
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            ["Total", "312 hrs"],
            ["Avg", "3.2 hrs/day"],
            ["Best streak", "18 days"],
          ].map(([label, value]) => (
            <div key={label}
              className="text-[11px] font-mono text-[#a5a5ff] rounded-full px-3 py-1 whitespace-nowrap"
              style={{ background: "rgba(74,74,232,0.12)", border: "1px solid rgba(165,165,255,0.15)" }}>
              {label} <span className="text-[#e8e8ff] font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable graph */}
      <div className="overflow-x-auto pb-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(165,165,255,0.2) transparent" }}>
        <div style={{ minWidth: 720 }}>

          {/* Month labels */}
          <div className="flex ml-8 mb-1.5">
            {monthPositions.map((pos, i) => {
              const next = monthPositions[i + 1]
              const span = next ? next.week - pos.week : weeksNeeded - pos.week
              return (
                <div key={pos.month}
                  className="text-[10px] font-mono uppercase tracking-wide text-[#3a3a7a] shrink-0"
                  style={{ width: span * 16 }}>
                  {MONTHS[pos.month]}
                </div>
              )
            })}
          </div>

          {/* Day labels + grid */}
          <div className="flex">
            <div className="flex flex-col gap-[3px] mr-2 pt-0.5">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((l, i) => (
                <div key={i} className="text-[9px] font-mono text-[#3a3a7a] h-[13px] leading-[13px]">{l}</div>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {Array.from({ length: weeksNeeded }, (_, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }, (_, dow) => {
                    const di = w * 7 + dow - startDow
                    const outOfRange = di < 0 || di >= data.length
                    const entry = outOfRange ? null : data[di]
                    const level = entry ? getLevel(entry.hrs) : 0

                    return (
                      <div
                        key={dow}
                        title={
                          !entry ? "" :
                          entry.hrs === 0
                            ? `No session — ${entry.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`
                            : `${entry.hrs.toFixed(1)} hrs — ${entry.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`
                        }
                        className={[
                          "w-[13px] h-[13px] rounded-[3px] transition-transform duration-150",
                          "hover:scale-[1.35] hover:brightness-125 cursor-default",
                          CELL_CLASSES[level],
                          outOfRange ? "opacity-0 pointer-events-none" : "",
                        ].join(" ")}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
        <span className="text-[10px] font-mono text-[#3a3a7a]">0 hrs = no session logged</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#3a3a7a]">Less</span>
          {([0, 1, 2, 3, 4] as const).map(l => (
            <div key={l} className={`w-[11px] h-[11px] rounded-[2px] ${CELL_CLASSES[l]}`} />
          ))}
          <span className="text-[10px] font-mono text-[#3a3a7a]">More</span>
        </div>
      </div>
    </div>
  )
}