/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Box, Button, makeStyles, Typography } from '@material-ui/core'
import { useSession, useVesting, useWallet } from 'contexts'
import { checkAuthentication, getShortWalletAddress } from 'utils'
import { WalletType } from 'types'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { NavBar } from './NavBar'

export const Home = () => {
 
  return (
    <div className="w-full h-screen bg-no-repeat bg-center" style={{backgroundImage: 'url(/images/back_hero.png)'}}>
        <NavBar />
    </div>
  )
}
