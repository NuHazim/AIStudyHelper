"use client"
import { useEffect,useState } from "react";
import Link from "next/link";

export default function MobileHeader(){
    const [scrolled, setScrolled] = useState(false)
    
        useEffect(() => {
            const handleScroll = () => {
                setScrolled(window.scrollY > 10)
            }
    
            window.addEventListener("scroll", handleScroll)
    
            return () => window.removeEventListener("scroll", handleScroll)
        }, [])
    return(
        <>
        <div className={`z-10 flex justify-between h-18 items-center px-4 fixed top-0 right-0 left-0 ${scrolled? "bg-white/10 backdrop-blur-lg":""}`}>
            <div className="flex gap-2 items-center hover:cursor-pointer">
                <i className="fa-solid fa-book-open-reader bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white p-2 rounded-lg text-lg font-medium shadow-[0_0_18px_rgba(108,108,245,0.5)]"></i>
                <h1 className="text-lg font-bold bg-gradient-to-r from-[#a5a5ff] to-[#e0e0ff] bg-clip-text text-transparent">Clock In</h1>
            </div>
            <div className="flex gap-3 items-center">
                <Link href="" className="transition-all duration-200 ease-in-out bg-transparent text-[#a5a5ff] border border-[rgba(108,108,245,0.6)] px-3 py-2 rounded-lg text-xs hover:bg-[rgba(108,108,245,0.6)] hover:text-white">Sign In</Link>
                <Link href="" className="bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white px-3 py-2 rounded-lg text-xs hover:shadow-[0_0_18px_rgba(108,108,245,0.5)]">Get Started Free</Link>
            </div>
        </div>
        </>
    )
}