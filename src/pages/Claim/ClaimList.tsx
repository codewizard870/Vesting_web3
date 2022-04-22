/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Box, makeStyles } from '@material-ui/core'
import { ClaimDetail } from './ClaimDetail'
import { useVesting, useWallet } from 'contexts'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
}))

export const ClaimList = () => {
  const classes = useStyles()
  const { account } = useWallet()
  const { vestingList } = useVesting()
  const userVestingList = vestingList.filter(
    (item) =>
      item.recipient.toLowerCase() === account?.toLowerCase() && item.amount.gt(0)
  )

  return (
    <Box className={classes.root}>      
      {userVestingList.map((info, index) => (
        <ClaimDetail info={info} key={index} />
      ))}
    </Box>
  )
}
