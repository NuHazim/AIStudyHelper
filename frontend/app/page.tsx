import Image from "next/image";
import Header from "./components/Header";
import Link from "next/link";
export default function Home() {
  return (
    <div className="h-screen">
      <Header/>
      <div className="flex justify-center gap-8 items-center mt-18 ">
        <div>
          <h1 className="font-bold text-6xl mb-4 leading-18">Studying is <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Brutal</span>. <br/><span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Survive</span> it with <span className="bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">AI</span></h1>
          <p className="text-[#a5a5ff] max-w-120 text-xl">Ditch the stress, organize the chaos, and <strong className="text-[#c8c8ff]">dominate your semester</strong> using <strong className="text-[#c8c8ff]">AI Tools</strong> designed to keep you focused and burnout-free.</p>
          <div className="flex my-8 gap-4">
            <Link href="" className="bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white px-6 py-2.5 rounded-lg text-lg transition-all duration-200 ease-in-out hover:shadow-[0_0_18px_rgba(108,108,245,0.5)]"><i className="fa-solid fa-bolt"></i> Start Now</Link>
            <p className="transition-all duration-200 ease-in-out bg-transparent text-[#a5a5ff] border border-[rgba(108,108,245,0.6)] px-6 py-2.5 rounded-lg text-lg hover:cursor-pointer hover:bg-[rgba(108,108,245,0.6)] hover:text-white">See How it Works <i className="fa-solid fa-angle-right"></i></p>
          </div>
        </div>
        <div>
          <img src="/images/heroImage.webp" className="animate-float"/>
        </div>
      </div>
    </div>
  )
}
