/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useVesting, useWallet } from 'contexts';
import { useHistory } from 'react-router-dom';
import { formatTime } from 'utils';
import { VestingInfo, VestingType } from 'types';

const useStyles = makeStyles(() => ({
  root: {
    width: 600,
    borderRadius: 5,
    border: '1px solid black',
    margin: '1rem',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  row: {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    width: '40%',
    fontSize: 20,
  },
  value: {
    width: '40%',
    fontWeight: 'bold',
    fontSize: 20,
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

  const getVestedAmount = () => {
    if (info) {
      if (Math.round(availableAmount) === 0) {
        return Math.round(info.claimedAmount);
      }
      const type = vestingTypes[info.typeId];
      if (type) {
        const duration = type.endTime - type.startTime;
        const current = new Date().getTime() / 1000 - type.startTime;
        return Math.round((info.amount * current) / duration);
      }
    }
    return 0;
  };

  const handleClaim = async () => {
    setLoading(true);
    if (info) {
      await claim(info.vestingId);
    }
    setLoading(false);
  };

  return (
    <Box className={classes.root}>
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
          {getVestedAmount().toLocaleString()} FLD
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
  );
};
