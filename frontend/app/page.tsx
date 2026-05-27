import Header from "./components/Header";
import Link from "next/link";
import WhatWeDoCard from "./components/WhatWeDoCard";
export default function Home() {
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
            <Link href="" className="bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white px-6 py-2.5 rounded-lg text-lg transition-all duration-200 ease-in-out hover:shadow-[0_0_18px_rgba(108,108,245,0.5)] text-center">
              <i className="fa-solid fa-bolt"></i> Start Now
            </Link>
            <p className="transition-all duration-200 ease-in-out bg-transparent text-[#a5a5ff] border border-[rgba(108,108,245,0.6)] px-6 py-2.5 rounded-lg text-lg hover:cursor-pointer hover:bg-[rgba(108,108,245,0.6)] hover:text-white text-center">
              See How it Works <i className="fa-solid fa-angle-right"></i>
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-center items-center max-w-lg w-full">
          <img src="/images/heroImage.webp" className="-z-2 animate-float w-full h-auto" />
        </div>

      </div>
      <div className="py-20 flex flex-col gap-6 justify-center items-center">
        <p className="text-[#a5a5ff] font-bold">WHAT CLOCK IN DOES</p>
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
      <div className="flex justify-center items-center">
        <div>
          <p className="text-[#a5a5ff] font-bold">AI ASSISTANT</p>
          <h1 className="text-5xl font-bold">Your intelligent <br/><span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">academic co-pilot</span></h1>
          <p className="text-[#a5a5ff] max-w-xl py-4"><strong>More than a Chatbot.</strong> Clock In's AI <strong>understands</strong> your academic workload, builds workflows, and coaches you through the <strong>hard moments</strong> with <strong>emotional intelligence.</strong></p>
        </div>
        <div className="flex-1 flex justify-center items-center max-w-lg w-full">
          <img src="/images/heroImage.webp" className="-z-2 animate-float w-full h-auto" />
        </div>
      </div>
    </div>
  )
}