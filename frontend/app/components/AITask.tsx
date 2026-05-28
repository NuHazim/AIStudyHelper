type AITaskInfo = {
  iconLogo: string
  title: string
  desc: string
}

export default function AITask({ iconLogo, title, desc }: AITaskInfo) {
  return (
    <div className="
      group
      flex gap-4 mb-2
      bg-[#0a0a2e] hover:bg-[#0f0f3a]
      border border-[#a5a5ff] hover:border-[#c8c8ff]
      py-3 px-4 rounded-xl
      cursor-pointer relative overflow-hidden
      transition-all duration-250 ease-out
      hover:-translate-y-[3px]
      -z-2
      hover:shadow-[0_0_0_1px_rgba(165,165,255,0.27),_0_8px_24px_rgba(165,165,255,0.2)]
    ">

      <div className="
        absolute inset-0 pointer-events-none
        bg-gradient-to-br from-[rgba(165,165,255,0.08)] to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
      " />

      <div className="mt-[2px] shrink-0">
        <i className={`${iconLogo} text-[22px] text-[#a5a5ff]
          group-hover:text-[#d0d0ff]
          transition-all duration-300
          group-hover:scale-125 group-hover:-rotate-6
          inline-block
        `} />
      </div>

      <div>
        <p className="text-[#a5a5ff] group-hover:text-[#d0d0ff] font-bold text-lg transition-colors duration-250">
          {title}
        </p>
        <p className="text-[#a5a5ff] opacity-75 group-hover:opacity-100 transition-opacity duration-250">
          {desc}
        </p>
      </div>

    </div>
  )
}