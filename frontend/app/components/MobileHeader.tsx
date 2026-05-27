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
        <div className={`flex justify-between h-15 items-center px-8 fixed top-0 right-0 left-0 ${scrolled? "bg-blue-600":""}`}>
            <div className="flex gap-2 items-center hover:cursor-pointer">
                <i className="fa-solid fa-book-open-reader bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white p-2.5 rounded-lg text-2xl font-medium shadow-[0_0_18px_rgba(108,108,245,0.5)]"></i>
                <h1 className="text-xl font-bold">Clock In</h1>
            </div>
            <div className="flex gap-3 items-center">
                <Link href="" className="bg-transparent text-[#a5a5ff] border border-[rgba(108,108,245,0.6)] px-6 py-2.5 rounded-lg text-sm font-medium">Sign In</Link>
                <Link href="" className="bg-gradient-to-br from-[#7c3aed] to-[#4a4ae8] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:shadow-[0_0_18px_rgba(108,108,245,0.5)]">Get Started Free</Link>
            </div>
        </div>
        </>
    )
}