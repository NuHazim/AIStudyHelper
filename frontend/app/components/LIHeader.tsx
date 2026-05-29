type LIHeaderInfo={
    pageName:string
    pageDesc:string
}
export default function LIHeader({pageName,pageDesc}:LIHeaderInfo){
    return(
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">{pageName}</h1>
                <p className="text-gray-600">{pageDesc}</p>
            </div>
            <div>
                <p className="inline-block py-2 px-6 text-[#e2ac24] border border-[#e2ac24] bg-[#352c25] rounded-xl">🔥<span>14</span> day streak</p>
                <p className="inline-block p-2 border border-gray-800 rounded-xl"><i className="fa-regular fa-bell"></i></p>
                <p className="inline-block p-2 bg-blue-300 text-white rounded-xl"><i className="fa-regular fa-user"></i></p>
            </div>
        </div>
    )
}