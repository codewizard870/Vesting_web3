/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent
} from '@material-ui/core'
import PaperComponent from 'components/DraggableModalPaper'
import { useVesting } from 'contexts'
import { VestingInfo } from 'types'
import { BigNumber } from 'ethers'
import { formatEther } from 'utils'

const useStyles = makeStyles(() => ({
    root: {
        width: 500,
        margin: '1rem',
        padding: '1rem',
        boxSizing: 'border-box',
        border: '1px solid black',
        borderRadius: 8,
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    row: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0.5rem',
    },
    input: {
        width: '100%',
    },
}))

interface IAddVesting {
    isOpen: boolean
    handleClose: () => void
    edit: boolean
    info: Maybe<VestingInfo>
}

export const Web3Modal = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
    }
    return (
        <div>
            <Dialog
                onClose={() => handleClose()}
                aria-labelledby="customized-dialog-title"
                open={isOpen}
                PaperComponent={PaperComponent}
            >
                {/* <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title"> */}
                <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                    <div className='flex justify-between gap-6 md:gap-10'>
                        <div className='text-[24px] font-semibold text-[#474747]'>Connect a Wallet</div>
                        <div className='cursor-pointer' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.473" height="19.473" viewBox="0 0 19.473 19.473">
                                <g id="Group_2741" data-name="Group 2741" transform="translate(-348.456 -22.585)">
                                    <path id="Path_1136" data-name="Path 1136" d="M-2163.129,15066l16.643,16.645" transform="translate(2513 -15042)" fill="none" stroke="#b9b9b9" strokeLinecap="round" strokeWidth="2" />
                                    <path id="Path_1137" data-name="Path 1137" d="M0,0,16.643,16.644" transform="translate(366.514 24) rotate(90)" fill="none" stroke="#b9b9b9" strokeLinecap="round" strokeWidth="2" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className='text-[18px] font-regular text-[#474747]'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className='flex justify-between p-4 md:p-5'>
                        <div className='text-[18px] font-medium text-[#050025]'>Metamask</div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
