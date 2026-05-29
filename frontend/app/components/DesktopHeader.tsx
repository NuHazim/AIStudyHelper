"use client"
import { useEffect,useState } from "react";
import Link from "next/link";

export default function DesktopHeader(){
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])
    return (
        <>
        <div className={`z-10 flex justify-between h-18 items-center pl-8 pr-4 fixed top-0 right-0 left-0 transition-all border-[#1a1a5e] duration-300 ease-in-out ${scrolled? "bg-[#050510] border-b border-[#1a1a5e]":""}`}>
            <div className="flex gap-2 items-center hover:cursor-pointer">
                <i className="fa-solid fa-book-open-reader bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white p-2.5 rounded-lg text-2xl font-medium shadow-[0_0_18px_rgba(108,108,245,0.5)]"></i>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Clock In</h1>
            </div>
            <div className="flex gap-6 justify-center items-center">
                <a href="#features" className="text-gray-400 hover:cursor-pointer hover:text-white">Features</a>
                <a href="#aiAssistant" className="text-gray-400 hover:cursor-pointer hover:text-white">AI Assistant</a>
                <a href="#productivity" className="text-gray-400 hover:cursor-pointer hover:text-white">Productivity</a>
            </div>
            <div className="flex gap-3 items-center">
                <Link href="/Login" className="transition-all duration-200 ease-in-out bg-transparent text-[#a5a5ff] border border-[rgba(108,108,245,0.6)] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0a0a2e] hover:text-white">Sign In</Link>
                <Link href="/Login" className="bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:shadow-[0_0_18px_rgba(108,108,245,0.5)]">Get Started Free</Link>
            </div>
        </div>
        </>
    )
}