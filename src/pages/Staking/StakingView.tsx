/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useStaking } from 'contexts';
import { StakingPool } from './StakingPool';

const useStyles = makeStyles(() => ({
  root: {
    padding: '1rem',
    boxSizing: 'border-box',
    border: '1px solid black',
    borderRadius: 8,
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export const StakingView = () => {
  const classes = useStyles();
  const { poolList, updatePoolList } = useStaking();

  useEffect(() => {
    updatePoolList();
  }, []);

  return (
    <Box className={clsx(classes.root, classes.flex)}>
      {poolList.map((poolInfo, pid) => (
        <StakingPool poolInfo={poolInfo} pid={pid} />
      ))}
    </Box>
  );
};
