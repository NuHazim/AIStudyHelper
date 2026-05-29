import Sidebar from "../components/Sidebar"
export default function Reminders(){
    return(
        <div className="flex h-screen">
            <Sidebar/>
            <div className="bg-black flex-1 transition-all duration-300 ease-in-out">
                reminders content
            </div>
        </div>
    )
}