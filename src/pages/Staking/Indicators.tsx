import React, { useState } from 'react'
import { BigNumber } from 'ethers'
import { formatEther, parseEther } from 'utils'
import { useWallet } from 'contexts'

export const Indicators = () => {
    const { tokenBalance, account } = useWallet()

    return (
        <div className="w-full flex flex-col px-6 md:px-0 items-center">
            <div className='mt-16 md:hidden'>
                <div className='text-[26px] font-semibold text-[#051C42] uppercase'>Staking/LP</div>
                <div className='bg-[#3FBCE9] h-0.5 w-full'></div>
            </div>
            <div className="w-full mt-12 md:mt-10 flex flex-col gap-8 xl:gap-12 xl:flex-row">
                <div className="w-full flex gap-8 xl:gap-12 flex-col md:flex-row basis-1/2">
                    <div className="flex-1 rounded-[24px] bg-white basis-1/2 w-full shadow-xl">
                        <div className='h-[124px] flex justify-center items-center w-full '>
                            <span className='text-[#0A208F] text-[34px] font-medium'>
                                {'25%'}
                            </span>
                        </div>
                        <div className='h-[86px] flex justify-center items-center rounded-b-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
                            <span className='text-[#050025] text-[22px] font-semibold'>
                                {'APY for LP'}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 rounded-[24px] bg-white basis-1/2 w-full shadow-xl">
                        <div className='h-[124px] flex justify-center items-center w-full '>
                            <span className='text-[#0A208F] text-[34px] font-medium'>
                                {'25%'}
                            </span>
                        </div>
                        <div className='h-[86px] flex justify-center items-center rounded-b-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
                            <span className='text-[#050025] text-[22px] font-semibold'>
                                {'APY on FLD staking'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-full flex gap-8 xl:gap-12 flex-col md:flex-row  basis-1/2">
                    <div className="flex-1 rounded-[24px] bg-white basis-1/2 w-full shadow-xl">
                        <div className='h-[124px] flex justify-center items-center w-full '>
                            <span className='text-[#0A208F] text-[34px] font-medium'>
                                {'$15,121,223'}
                            </span>
                        </div>
                        <div className='h-[86px] flex justify-center items-center rounded-b-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
                            <span className='text-[#050025] text-[22px] font-semibold'>
                                {'Total Value Locked'}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 rounded-[24px] bg-white basis-1/2 w-full shadow-xl">
                        <div className='h-[124px] flex justify-center items-center w-full '>
                            <span className='text-[#0A208F] text-[34px] font-medium'>
                                {account?formatEther(tokenBalance || BigNumber.from(0), undefined, 1, true)+" FLD":'---'}
                            </span>
                        </div>
                        <div className='h-[86px] flex justify-center items-center rounded-b-[24px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
                            <span className='text-[#050025] text-[22px] font-semibold'>
                                {'Your FLD Balance'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
