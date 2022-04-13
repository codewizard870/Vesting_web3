/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { PoolInfo, UserInfo } from 'types';
import { useStaking, useWallet } from 'contexts';
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
}));

interface IStakingPool {
  poolInfo: PoolInfo;
  pid: number;
}

export const StakingPool: React.FC<IStakingPool> = ({ poolInfo, pid }) => {
  const classes = useStyles();
  const { getUserInfo, rewards, deposit, withdraw, claim } = useStaking();
  const { getTokenBalance, account } = useWallet();  
  const stakeToken = pid === 0 ? 'FLD-ETH' : 'FLD';

  const [userInfo, setUserInfo] = useState<Maybe<UserInfo>>(null);
  const [value, setValue] = useState('');
  const [tokenBalance, setTokenBalance] = useState<BigNumber>(BigNumber.from(0));
  const [loading, setLoading] = useState(false);

  const updateUserInfo = async () => {
    const res = await getUserInfo(pid);
    setUserInfo(res);
  };

  const updateTokenBalance = async () => {
    if (account) {
      const res = await getTokenBalance(account, poolInfo.stakeToken);
      setTokenBalance(res);
    } else {
      setTokenBalance(BigNumber.from(0));
    }
  };

  useEffect(() => {
    updateUserInfo();
    updateTokenBalance();
  }, [pid, poolInfo, account]);

  const handleDeposit = async () => {
    setLoading(true);
    const res = await deposit(pid, Number(value));
    if (res) {
      setValue('');
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    setLoading(true);
    const res = await withdraw(pid, Number(value));
    if (res) {
      setValue('');
    }
    setLoading(false);
  };

  const handleHarvest = async () => {
    setLoading(true);
    await claim(pid);
    setLoading(false);
  };

  const isValueCorrect = () => {
    return !isNaN(Number(value)) && Number(value) > 0;
  };

  return (
    <Box className={clsx(classes.root, classes.flex)}>
      <Typography variant="h5">{stakeToken} Pool</Typography>
      <br />

      <Box className={classes.row}>
        <TextField
          variant="outlined"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
        />

        <Button
          color="primary"
          variant="contained"
          onClick={handleDeposit}
          disabled={
            loading || !isValueCorrect() || BigNumber.from(Number(value)).gt(tokenBalance)
          }
        >
          Deposit
        </Button>

        <Button
          color="primary"
          variant="contained"
          onClick={handleWithdraw}
          disabled={
            loading ||
            !isValueCorrect() ||
            BigNumber.from(Number(value)).gt(userInfo?.amount || BigNumber.from(0))
          }
        >
          Withdraw
        </Button>
      </Box>

      <Box className={classes.row}>
        <Typography>
          Your Balance:{' '}
          <b>
            {formatEther(tokenBalance || BigNumber.from(0), undefined, 3, true)} {stakeToken}
          </b>
        </Typography>
      </Box>

      <Box className={classes.row}>
        <Typography>
          Your Staked Amount:{' '}
          <b>
            {formatEther(userInfo?.amount || BigNumber.from(0), undefined, 3, true)} {stakeToken}
          </b>
        </Typography>
      </Box>

      <Box className={classes.row}>
        <Typography>
          Reward Amount: <b>{formatEther(rewards[pid] || BigNumber.from(0), undefined, 3, true)} FLD</b>
        </Typography>

        <Button
          color="primary"
          variant="contained"
          onClick={handleHarvest}
          disabled={loading || rewards.length>0 && rewards[pid].gte(0)}
        >
          Harvest
        </Button>
      </Box>

      {pid === 0 && (
        <Button
          onClick={() => {
            window.open(
              'https://app.uniswap.org/#/add/v2/ETH/0xb00f1f831261FbeaEE98f5D3EbB22EcC3c7726A5?chain=rinkeby',
              '_blank'
            );
          }}
        >
          <Typography>Add liquidity</Typography>
        </Button>
      )}
    </Box>
  );
};
