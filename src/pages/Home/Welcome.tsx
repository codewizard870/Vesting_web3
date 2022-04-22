/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Box, Button, makeStyles, Typography } from '@material-ui/core'
import { useSession, useVesting, useWallet } from 'contexts'
import { checkAuthentication, getShortWalletAddress } from 'utils'
import { WalletType } from 'types'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { NavBar } from './NavBar'

export const Welcome = () => {

    return (
        <div className="w-full">
            <div className='text-[60px] font-semibold text-[#051C42] uppercase'>
                LIQUIDITY AGGREGATION,
                TRANSFORMED
            </div>
            <div className='text-[22px] font-regular text-[#051C42]'>
                FLUID is the ultra-low latency CeDeFi liquidity aggregator providing AI quant-based models to tackle fragmented liquidity in virtual asset markets.
            </div>
        </div>
    )
}
