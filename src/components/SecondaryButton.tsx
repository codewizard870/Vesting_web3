interface ButtonProps {
    width?: string | undefined,
    children?: React.ReactNode,    
    onClick: () => void,
    disabled: boolean | undefined
}

export const SecondaryButton = ({width = 'fit-content', children, onClick, disabled = false}:ButtonProps) => {

    return (
        <div className={`rounded-full ${disabled?'border-0':'border-2'} border-[#050025] flex gap-2 items-center justify-center py-4 ${disabled?'cursor-default':'cursor-pointer'} ${width==='fit-content'?'px-6':''}`} onClick={onClick} style={{width: width, backgroundColor: disabled?'#E0E0E0':'#FFFFFF'}}>            
            <span className={`text-[18px] ${disabled?'text-[#A8A8A8]':'text-black'} font-semibold uppercase`}>{children}</span>
        </div>
    )
}
