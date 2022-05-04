/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  makeStyles,
  TextField
} from '@material-ui/core'
import { PoolInfo, UserInfo } from 'types'
import { useStaking, useWallet } from 'contexts'
import { BigNumber } from 'ethers'
import { formatEther, parseEther } from 'utils'
import { PrimaryButton } from 'components/PrimaryButton'
import { SecondaryButton } from 'components/SecondaryButton'
import { ADD_LIQUIDITY_LINK } from 'config'

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
}))

interface IStakingPool {
  poolInfo: PoolInfo
  pid: number
}

export const StakingPool: React.FC<IStakingPool> = ({ poolInfo, pid }) => {
  const classes = useStyles()
  const { getUserInfo, rewards, deposit, withdraw, claim } = useStaking()
  const { updateTokenBalance, tokenBalance, account } = useWallet()
  const stakeToken = pid === 0 ? 'FLD-ETH' : 'FLD'

  const [userInfo, setUserInfo] = useState<Maybe<UserInfo>>(null)
  const [value, setValue] = useState('')  
  const [loading, setLoading] = useState(false)

  const updateUserInfo = async () => {
    const res = await getUserInfo(pid)
    setUserInfo(res)
  }

  useEffect(() => {
    if (account) {
      updateUserInfo()
      updateTokenBalance()
    }
  }, [pid, poolInfo, account])

  const handleDeposit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const res = await deposit(pid, Number(value))
    updateTokenBalance()
    if (res) {
      setValue('')
    }
    setLoading(false)
  }

  const handleWithdraw = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const res = await withdraw(pid, Number(value))
    updateTokenBalance()
    if (res) {
      setValue('')
    }
    setLoading(false)
  }

  const handleHarvest = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await claim(pid)
    updateTokenBalance()
    setLoading(false)
  }

  const isValueCorrect = () => {
    return !isNaN(Number(value)) && Number(value) > 0
  }

  return (
    <>
      <div className='max-w-[510px] w-full rounded-[19px] bg-white shadow-lg'>
        <div className='h-[85px] flex justify-center items-center rounded-t-[19px] bg-gradient-to-r from-[#F3E8FF] to-[#7AFBFD] w-full'>
          <span className='text-[#0A208F] text-[29px] font-semibold'>
            {stakeToken} Pool
          </span>
        </div>
        <div className='w-full p-5'>
          <TextField
            variant="outlined"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value !== '' ? Number(e.target.value).toString() : '')}
            disabled={loading}
            style={{ width: '100%' }}
            margin="dense"
            inputProps={{ style: { fontSize: 42, color: '#3F3F3F', textAlign: 'center' } }} // font size of input text            
            InputLabelProps={{ style: { fontSize: 42, color: '#3F3F3F', textAlign: 'center' } }}
            onInput={(e: any) => {
              // e.target.value = Math.max(0, Number(e.target.value)).toString().slice(0, 12)
              if (Number(e.target.value) < 0) e.target.value = -Number(e.target.value)
            }}
          />
          <div className='flex justify-between gap-6 w-full mt-5 mb-3'>
            <SecondaryButton
              onClick={handleDeposit}
              width='220px'
              disabled={
                loading || !isValueCorrect() || parseEther(Number(value).toString()).gt(tokenBalance)
              }
            >
              Deposit
            </SecondaryButton>

            <PrimaryButton
              onClick={handleWithdraw}
              width='220px'
              disabled={
                loading ||
                !isValueCorrect() ||
                parseEther(Number(value).toString()).gt(userInfo?.amount || BigNumber.from(0))
              }
            >
              Withdraw
            </PrimaryButton>
          </div>
          <div className='w-full flex justify-between py-3 border-b border-[#CECECE]'>
            <div className='text-[14px] md:text-[17px] text-[#0A208F] font-medium uppercase'>Your Balance</div>
            <div className='text-[16px] md:text-[20px] text-[#676767] font-regular'>
              {formatEther(tokenBalance || BigNumber.from(0), undefined, 3, true)} {stakeToken}
            </div>
          </div>
          <div className='w-full flex justify-between py-3 border-b border-[#CECECE]'>
            <div className='text-[14px] md:text-[17px] text-[#0A208F] font-medium uppercase'>Your Staked Amount</div>
            <div className='text-[16px] md:text-[20px] text-[#676767] font-regular'>
              {formatEther(userInfo?.amount || BigNumber.from(0), undefined, 3, true)} {stakeToken}
            </div>
          </div>
          <div className='w-full flex justify-between py-3'>
            <div className='text-[14px] md:text-[17px] text-[#0A208F] font-medium uppercase'>Reward Amount</div>
            <div className='text-[16px] md:text-[20px] text-[#676767] font-regular'>
              {formatEther(rewards[pid] || BigNumber.from(0), undefined, 3, true)} FLD
            </div>
          </div>
          <div className='w-full flex flex-col justify-center md:flex-row md:justify-between gap-8 md:gap-0 items-center mt-1 mb-3'>
            <div>
              {pid === 0 && (
                <a href={ADD_LIQUIDITY_LINK} target="_blank">
                  <span className='text-[18px] font-medium text-[#3FBCE9] underline underline-offset-4'>Add Liquidity</span>
                </a>
              )}
            </div>
            <SecondaryButton
              onClick={handleHarvest}
              width='220px'
              disabled={loading || rewards.length > 0 && rewards[pid].lte(0)}
            >
              Harvest
            </SecondaryButton>
          </div>
        </div>
      </div>
    </>
  )
}
