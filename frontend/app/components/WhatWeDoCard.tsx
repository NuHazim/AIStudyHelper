type CardInfo={
    iconClass:string
    title:string
    desc:string
    smallCat:string
    smallCatColor:string
    smallCatBgColor:string
}
export default function WhatWeDoCard({iconClass,title,desc,smallCat,smallCatColor,smallCatBgColor}:CardInfo){
    const catList=smallCat.split(",")
    const catColorList=smallCatColor.split(",")
    const catBgColorList=smallCatBgColor.split(",")
    return(
        <div className="hover:-translate-y-2 transition-all duration-200 ease-in-out max-w-80 bg-[rgba(108,108,245,0.6)]/20 backdrop-blur-2xl shadow-lg p-6 rounded-lg border border-[rgba(108,108,245,0.6)]">
            <i className={iconClass}></i>
            <p className="mt-2"><strong className="text-[#a5a5ff]">{title}</strong></p>
            <p className="text-[#a5a5ff]/60 mt-2 mb-6">{desc}</p>
            <div className="flex flex-wrap gap-2">
                {catList.map((eachCatList, i) => (
                    <p
                        key={i}
                        className="inline-block font-bold border px-2.5 py-0.5 rounded-xl text-sm"
                        style={{
                        color: catColorList[i],
                        backgroundColor: catBgColorList[i],
                        borderColor: catColorList[i],
                        }}
                    >
                        {eachCatList}
                    </p>
                ))}
            </div>
        </div>
    )
}