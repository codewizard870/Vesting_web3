/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useVesting, useWallet } from 'contexts';
import { useHistory } from 'react-router-dom';
import { formatTime } from 'utils';
import { VestingInfo, VestingType } from 'types';
import { VestedChart } from './VestedChart';

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
    padding: '1rem',
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
  const [availableAmount, setAvailableAmount] = useState(0);
  const [loading, setLoading] = useState(false);

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
            {info?.amount.toLocaleString() || 0} FLD
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
            {Math.round(
              (info?.amount || 0) - (info?.claimedAmount || 0)
            ).toLocaleString()}{' '}
            FLD
          </Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Tokens claimed</Typography>
          <Typography className={classes.value}>
            {Math.round(info?.claimedAmount || 0).toLocaleString()} FLD
          </Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Tokens vested</Typography>
          <Typography className={classes.value}>
            {Math.round((info?.claimedAmount || 0) + availableAmount).toLocaleString()} FLD
          </Typography>
        </Box>

        <Box className={classes.row}>
          <Typography className={classes.title}>Available to claim</Typography>
          <Typography className={classes.value}>
            {Math.round(availableAmount).toLocaleString()} FLD
          </Typography>

          <Button
            color="primary"
            variant="contained"
            style={{ height: 50 }}
            disabled={
              loading ||
              Math.round(availableAmount) <= 0 ||
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
            {tokenBalance.toLocaleString()} FLD
          </Typography>
          <Button
            color="primary"
            variant="contained"
            style={{ height: 50 }}
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
