interface ButtonProps {
    width?: string | undefined,
    children?: React.ReactNode,    
    onClick: () => void,
    disabled: boolean | undefined
}

export const PrimaryButton = ({width = 'fit-content', children, onClick, disabled = false}:ButtonProps) => {

    return (
        <div className={`rounded-full flex gap-2 items-center justify-center py-4 ${disabled?'cursor-default':'cursor-pointer'} ${width==='fit-content'?'px-6':''}`} onClick={onClick} style={{width: width, backgroundColor: disabled?'#E0E0E0':'#3FBCE9'}}>            
            <span className={`text-[18px] ${disabled?'text-[#A8A8A8]':'text-white'} font-semibold uppercase`}>{children}</span>
        </div>
    )
}
