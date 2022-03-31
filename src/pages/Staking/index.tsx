/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { StakingView } from './StakingView';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '2rem',
    boxSizing: 'border-box',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export const Staking = () => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, classes.flex)}>
      <Box>
        <Typography variant="h3">Welcome to FLUID Staking</Typography>
        <br />
        <Typography variant="h5"></Typography>
        <br />
        <StakingView />
      </Box>
    </Box>
  );
};
