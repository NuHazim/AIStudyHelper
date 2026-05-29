import Header from "./components/Header";
import Link from "next/link";
import WhatWeDoCard from "./components/WhatWeDoCard";
import AITask from "./components/AITask";
import StudyHeatmap from "./components/StudyHeatMap";
import WeeklyStudyHours from "./components/WeeklyStudyHours";
import Footer from "./components/Footer";
export default function Home() {
  const cardBase = `
    relative overflow-hidden rounded-2xl
    border border-[rgba(165,165,255,0.1)]
    card-hover cursor-pointer
    before:absolute before:inset-0 before:rounded-2xl
    before:bg-gradient-to-br before:from-[rgba(74,74,232,0.06)] before:to-transparent
    before:opacity-0 before:transition-opacity before:duration-300
    hover:before:opacity-100
    hover:-translate-y-[5px]
    hover:border-[rgba(165,165,255,0.35)]
    hover:shadow-[0_0_0_1px_rgba(165,165,255,0.08),_0_20px_40px_rgba(10,10,46,0.6),_0_0_30px_rgba(74,74,232,0.12)]
    active:-translate-y-[2px]
  `
  return (
    <div className="min-h-screen">
      <Header/>
      <div className="flex flex-col md:flex-row justify-center gap-8 items-center mt-18 px-6 md:px-16 py-8">
        
        {/* Left */}
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <h1 className="font-bold text-4xl md:text-6xl mb-4 leading-tight md:leading-18">
            Studying is{" "}
            <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Brutal</span>.{" "}
            <br/>
            <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Survive</span>{" "}
            it with{" "}
            <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="text-[#a5a5ff] text-base md:text-xl max-w-xl mx-auto md:mx-0">
            Ditch the stress, organize the chaos, and{" "}
            <strong className="text-[#c8c8ff]">dominate your semester</strong> using{" "}
            <strong className="text-[#c8c8ff]">AI Tools</strong> designed to keep you focused and burnout-free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start my-8 gap-4">
            <Link href="/Login" className="bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white px-6 py-2.5 rounded-lg text-lg transition-all duration-200 ease-in-out hover:shadow-[0_0_18px_rgba(108,108,245,0.5)] text-center">
              <i className="fa-solid fa-bolt"></i> Start Now
            </Link>
            <a href="#features" className="transition-all duration-200 ease-in-out bg-transparent text-[#a5a5ff] border border-[rgba(108,108,245,0.6)] px-6 py-2.5 rounded-lg text-lg hover:cursor-pointer hover:bg-[#0a0a2e] hover:text-white text-center">
              See How it Works <i className="fa-solid fa-angle-right"></i>
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-center items-center max-w-lg w-full">
          <img src="/images/heroImage.webp" className="-z-2 animate-float w-full h-auto" />
        </div>

      </div>
      <div id="features" className="py-20 flex flex-col gap-6 justify-center items-center">
        <p className="text-[#a5a5ff] font-bold bg-white/10 backdrop-blur-lg shadow-lg py-2 px-6 rounded-4xl text-sm border">WHAT CLOCK IN DOES</p>
        <h1 className="text-3xl md:text-5xl font-bold text-center px-4">
          <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Everything</span> you need to{" "}
          <span className="bg-gradient-to-r from-[#e0e0ff] to-[#a5a5ff] bg-clip-text text-transparent">survive university</span>
        </h1>
        <p className="text-[#a5a5ff] text-center px-4 max-w-2xl">
          A complete <strong>AI-powered productivity ecosystem</strong> designed from the ground up for students who want to perform at their peak without burning out.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-3 md:px-0 max-w-5xl">
          <WhatWeDoCard
            iconClass="fa-regular fa-clock text-[#9b81e9] p-2 text-xl bg-[#252248] rounded-lg"
            title="AI Task & Workflow Generation"
            desc="Upload a project brief or describe your coursework and Overclock's AI will help you with zero effort required."
            smallCat="Auto-grouping,PDF import,CSV support"
            smallCatColor="#9b81e9,#1fadaf,#1d3ea0"
            smallCatBgColor="#252248,#112f43,#192748"
          />
          <WhatWeDoCard
            iconClass="fa-solid fa-heart-pulse text-[#1fadaf] p-2 text-xl bg-[#112f43] rounded-lg"
            title="Burnout Prevention"
            desc="AI monitors your workload patterns and sends smart warnings before you hit critical stress."
            smallCat="Smart alerts"
            smallCatColor="#1fadaf"
            smallCatBgColor="#112f43"
          />
          <WhatWeDoCard
            iconClass="fa-solid fa-crosshairs text-[#e2ac24] p-2 text-xl bg-[#352c25] rounded-lg"
            title="Focus Tracking"
            desc="Detects tab switches and inactivity, giving you a real concentration score for each session."
            smallCat="Score tracking"
            smallCatColor="#e2ac24"
            smallCatBgColor="#352c25"
          />
          <WhatWeDoCard
            iconClass="fa-brands fa-leanpub text-[#32ce95] p-2 text-xl bg-[#123036] rounded-lg"
            title="Flashcard Engine"
            desc="Drop in a lecture PDF and get flashcards, study questions, and a structured summary instantly."
            smallCat="Flashcards,Summarise"
            smallCatColor="#32ce95,#9b81e9"
            smallCatBgColor="#123036,#252248"
          />
          <WhatWeDoCard
            iconClass="fa-regular fa-bell text-[#f06c80] p-2 text-xl bg-[#341d31] rounded-lg"
            title="Smart Reminders"
            desc="Only deadlines that matter surface in your calendar with clean, relevant, and urgency-coded."
            smallCat="Calendar sync"
            smallCatColor="#f06c80"
            smallCatBgColor="#341d31"
          />
          <WhatWeDoCard
            iconClass="fa-solid fa-fire-flame-curved text-[#fb923c] py-2 px-3 text-xl bg-[rgba(249,115,22,0.15)] rounded-lg"
            title="Streak & XP System"
            desc="Earn XP for completing tasks, maintain daily streaks, and level up your productivity rating."
            smallCat="Gamified,XP rewards"
            smallCatColor="#e2ac24,#1d3ea0"
            smallCatBgColor="#352c25,#192748"
          />
        </div>
      </div>
      <div id="aiAssistant" className="flex py-20 justify-center md:gap-8 items-center">
        <div className="flex flex-col items-center md:items-start">
          <p className="-z-2 text-[#a5a5ff] font-bold bg-white/10 backdrop-blur-lg shadow-lg py-2 px-6 rounded-4xl text-sm border inline-block mb-4">AI ASSISTANT</p>
          <h1 className="text-3xl font-bold text-center md:text-left md:text-5xl">Your intelligent <br/><span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">academic co-pilot</span></h1>
          <p className="text-[#a5a5ff] px-4 text-sm max-w-xl py-4 text-center md:text-left md:text-base md:px-0"><strong>More than a Chatbot.</strong> Clock In's AI <strong>understands</strong> your academic workload, builds workflows, and coaches you through the <strong>hard moments</strong> with <strong>emotional intelligence.</strong></p>
          <div className="mx-4 md:mx-0">
            <AITask
              iconLogo="fa-regular fa-clipboard p-3 text-lg text-white bg-[#1fadaf] rounded-lg"
              title="Task Breakdown Assistance"
              desc="Breaks complex assignments into daily steps automatically."
            />
            <AITask
              iconLogo="fa-regular fa-calendar p-3 text-lg text-white bg-[#e2ac24] rounded-lg"
              title="Schedule Optimization"
              desc="Finds the best study windows based on your calendar."
            />
            <AITask
              iconLogo="fa-solid fa-person-chalkboard p-3 text-lg text-white bg-[#9b81e9] rounded-lg"
              title="Motivational Coaching"
              desc="Personalized encouragement when you need it most."
            />
            <AITask
              iconLogo="fa-solid fa-fire-burner p-3 text-lg text-white bg-[#FFA500] rounded-lg"
              title="Burnout Detection"
              desc="Monitors workload and flags danger zones early."
            />
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center max-w-lg w-full">
          <img src="/images/heroImage.webp" className="-z-2 animate-float w-full h-auto" />
        </div>
      </div>
      <div id="productivity" className="flex flex-col items-center gap-6 px-4 md:px-8">
        <p className="text-[#a5a5ff] font-bold bg-white/10 backdrop-blur-lg shadow-lg py-2 px-5 md:px-6 rounded-4xl text-xs md:text-sm border inline-block">
          PRODUCTIVITY ANALYTICS
        </p>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center leading-tight">
          <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">
            Know exactly
          </span>{" "}
          <span className="bg-gradient-to-r from-[#e0e0ff] to-[#a5a5ff] bg-clip-text text-transparent">
            where you stand
          </span>
        </h1>
        <p className="text-[#a5a5ff] text-center text-sm md:text-base px-2 max-w-2xl">
          <strong>Real-time dashboards</strong> that surface insights that actually matter for{" "}
          <strong>your academic performance.</strong>
        </p>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 md:gap-6 p-2 md:p-4">
          <div className="md:col-span-6 lg:col-span-7 border border-[#a5a5ff] bg-[#0a0a2e] rounded-2xl">
            <WeeklyStudyHours />
          </div>
          <div className="border border-[#a5a5ff] md:col-span-6 lg:col-span-5 bg-[#0a0a2e] rounded-2xl p-5 md:p-7 flex flex-col">
            <p className="text-lg md:text-xl mb-1">🔥</p>
            <p className="font-bold text-[#e8e8ff] text-sm md:text-base">
              Current Streak
            </p>
            <p className="text-[#3a3a7a] text-xs md:text-sm font-mono mb-4">
              Days studied in a row
            </p>
            <h1 className="my-3 md:my-4 bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent text-5xl md:text-7xl font-bold leading-none">
              14
            </h1>
            <p className="font-bold text-[#a5a5ff] text-xs md:text-sm">
              Longest: 21 days — Keep going!
            </p>
          </div>
          <div className="md:col-span-6 lg:col-span-12 border border-[#a5a5ff] bg-[#0a0a2e] rounded-2xl">
            <StudyHeatmap />
          </div>

        </div>
      </div>
      <div className="flex flex-col py-20 justify-center items-center gap-6">
        <p className="-z-2 text-[#a5a5ff] font-bold bg-white/10 backdrop-blur-lg shadow-lg py-2 px-6 rounded-4xl text-sm border inline-block mb-4">FREE TO START</p>
        <h1 className="text-3xl font-bold text-center md:text-left md:text-5xl">Ready to <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Clock In</span> for your semester?</h1>
        <p className="text-[#a5a5ff] text-center px-4 max-w-2xl"><strong>Start now</strong> and make <strong>your future self proud</strong></p>
        <Link href="/Login" className="bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white px-10 py-5 rounded-3xl text-2xl font-bold hover:shadow-[0_0_18px_rgba(108,108,245,0.5)]">Launch Dashboard <i className="fa-solid fa-arrow-right"></i></Link>
      </div>
      <Footer/>
    </div>
  )
}