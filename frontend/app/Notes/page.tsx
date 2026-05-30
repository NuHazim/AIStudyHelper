import Sidebar from "../components/Sidebar"
import LIHeader from "../components/LIHeader"
export default function Notes(){
    return(
        <div className="flex h-screen overflow-hidden">
            <Sidebar/>
            <div className="flex flex-col bg-black flex-1 transition-all duration-300 ease-in-out">
                <LIHeader pageName="Notes" pageDesc="Welcome back bruh"/>
                <div className="flex-1 overflow-y-auto w-full h-300 bg-blue-400">
                    
                </div>
            </div>
        </div>
    )
}