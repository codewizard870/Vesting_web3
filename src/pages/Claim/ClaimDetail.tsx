/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useVesting, useWallet } from 'contexts';
import { useHistory } from 'react-router-dom';
import { formatTime, formatEther, parseEther } from 'utils';
import { VestingInfo, VestingType } from 'types';
import { VestedChart } from './VestedChart';
import { BigNumber } from 'ethers'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    gap: '30px',
    width: '100%',
    margin: '1rem',
    padding: '1rem',
    borderRadius: 5,
    border: '1px solid black',
    boxSizing: 'border-box',
    [theme.breakpoints.down('lg')]: {
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    [theme.breakpoints.up('lg')]: {
      alignItems: 'center',
      flexWrap: 'nowrap'
    }
  },
  card: {
    [theme.breakpoints.down('lg')]: {
      minWidth: 750
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 450
    }
  },
  row: {
    padding: '0.4rem 1rem',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    width: '45%',
    fontSize: 16,
  },
  value: {
    width: '35%',
    fontWeight: 'bold',
    fontSize: 16,
  },
}));

interface IClaimDetail {
  info: VestingInfo;
}

export const ClaimDetail: React.FC<IClaimDetail> = ({ info }) => {
  const classes = useStyles();
  const { tokenBalance } = useWallet();
  const { claim, getClaimAvailable, vestingTypes } = useVesting();
  const history = useHistory();

  const [type, setType] = useState<Maybe<VestingType>>(null);
  const [availableAmount, setAvailableAmount] = useState<BigNumber>(BigNumber.from(0));
  const [loading, setLoading] = useState(false);

  const calcAvailableAmountWithDecimals = () => {        
    let claimed = formatEther(info?.claimedAmount, undefined, 0, false)      
    let restbydecimals = info?.claimedAmount.sub(parseEther(claimed, undefined))      
    let available = availableAmount.add(restbydecimals)
    return formatEther(available, undefined, 0, true)
  }

  const nextClaim = Math.max(
    (info?.lastClaim || 0) +
    (type?.lockupDuration || 0) -
    Math.floor(new Date().getTime() / 1000),
    0
  );

  useEffect(() => {
    if (vestingTypes.length > info.typeId) {
      setType(vestingTypes[info.typeId]);
    } else {
      setType(null);
    }
  }, [vestingTypes, info]);

  const getAvailableAmount = useCallback(
    async (vestingId: number) => {
      const res = await getClaimAvailable(vestingId);
      setAvailableAmount(res);
    },
    [getClaimAvailable, info]
  );

  useEffect(() => {
    if (info) {
      getAvailableAmount(info.vestingId);
    }
  }, [info, getAvailableAmount]);

  const handleClaim = async () => {
    setLoading(true);
    if (info) {
      await claim(info.vestingId);
    }
    setLoading(false);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.card}>
        <Box className={classes.row}>
          <Typography className={classes.title}>Vesting Type</Typography>
          <Typography className={classes.value}>{type?.name || ''}</Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Total Amount</Typography>
          <Typography className={classes.value}>
            {formatEther(info.amount, undefined, 0, true)} FLD
          </Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Next unlock in</Typography>
          <Typography className={classes.value}>
            {info ? (nextClaim > 0 ? formatTime(nextClaim) : 'Available') : ''}
          </Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Tokens pending</Typography>
          <Typography className={classes.value}>
            {formatEther(info.amount.sub(info.claimedAmount), undefined, 0, true)}{' '}
            FLD
          </Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Tokens claimed</Typography>
          <Typography className={classes.value}>
            {formatEther(info?.claimedAmount, undefined, 0, true)} FLD
          </Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Tokens vested</Typography>
          <Typography className={classes.value}>
            {formatEther(info.claimedAmount.add(availableAmount), undefined, 0, true)} FLD            
          </Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Available to claim</Typography>
          <Typography className={classes.value}>
            {/* {formatEther(availableAmount, undefined, 0, true)} FLD */}
            {calcAvailableAmountWithDecimals()} FLD
          </Typography>

          <Button
            color="primary"
            variant="contained"
            style={{ height: 35 }}
            disabled={
              loading ||
              availableAmount.lte(0) ||
              nextClaim > 0 ||
              !info
            }
            onClick={handleClaim}
          >
            {loading ? 'Claiming' : 'Claim'}
          </Button>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Your token balance</Typography>
          <Typography className={classes.value}>
            {formatEther(tokenBalance, undefined, 0, true)} FLD
          </Typography>
          <Button
            color="primary"
            variant="contained"
            style={{ height: 35 }}
            onClick={() => {
              history.push('/staking');
            }}
          >
            Stake
          </Button>
        </Box>
      </Box>
      <VestedChart info={info} />
    </Box>
  );
};
