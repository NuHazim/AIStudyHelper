type AITaskInfo={
    iconLogo:string
    title:string
    desc:string
}
export default function AITask({iconLogo,title,desc}:AITaskInfo){
    return(
        <div>
            <i className={iconLogo}></i>
            <div>
                <p>{title}</p>
                <p>{desc}</p>
            </div>
        </div>
    )
}