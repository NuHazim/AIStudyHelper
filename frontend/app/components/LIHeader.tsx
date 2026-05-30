import Link from "next/link"

type LIHeaderInfo={
    pageName:string
    pageDesc:string
}
export default function LIHeader({pageName,pageDesc}:LIHeaderInfo){
    return(
        <div className="flex py-3 px-4 justify-between items-center">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold">{pageName}</h1>
                <p className="text-gray-600">{pageDesc}</p>
            </div>
            <div className="flex gap-2 items-center justify-center">
                <p className="inline-block py-1 px-3 text-sm text-[#e2ac24] border border-[#e2ac24] bg-[#352c25] rounded-xl">🔥<span>14</span> day streak</p>
                <p className="inline-block py-1 px-2 cursor-pointer border border-gray-800 rounded-xl"><i className="fa-regular fa-bell"></i></p>
                <Link href="/Settings" className="py-1 px-2 cursor-pointer bg-blue-300 text-white rounded-xl"><i className="fa-regular fa-user"></i></Link>
            </div>
        </div>
    )
}