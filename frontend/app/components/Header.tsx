"use client"
import useIsMobile from "./useIsMobile"
import MobileHeader from "./MobileHeader"
import DesktopHeader from "./DesktopHeader"
export default function Header(){
    const isMobile = useIsMobile()
    return (
        <>
            {isMobile ? (
            <MobileHeader />
            ) : (
            <DesktopHeader />
            )}
        </>
    )
}