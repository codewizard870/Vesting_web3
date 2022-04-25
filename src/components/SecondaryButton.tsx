

import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

interface ButtonProps {
    width?: string | undefined,
    children?: React.ReactNode,
    onClick: (e: any) => void,
    disabled?: boolean | undefined,
}

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: "9999px",
        margin: '4px',
        color: "#FFFFFF",       
        fontFamily: "Gibson",
        fontWeight: 600,        
        [theme.breakpoints.down('md')]: {
            paddingTop: '7px',
            paddingBottom: '7px',
            fontSize: "16px"
        },
        [theme.breakpoints.up('md')]: {
            paddingTop: '11px',
            paddingBottom: '11px',
            fontSize: "18px"
        }
    },
}))

export const SecondaryButton = ({ width = 'fit-content', children, onClick, disabled = false }: ButtonProps) => {
    const classes = useStyles();

    return (
        <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            style={{ width: width, border: disabled?'2px solid #C8C8C8':'2px solid #050025' }}
            onClick={onClick}
            disabled={disabled}
            disableElevation
        >
            {/* {children} */}
            <span className={`text-[16px] md:text-[18px] ${disabled?'text-[#A8A8A8]':'text-[#051C42]'} font-semibold uppercase`}>{children}</span>
        </Button>
    )
}
