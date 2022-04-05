/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { ClaimList } from './ClaimList';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '2rem',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
}));

export const Claim = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h3">Welcome to FLUID Token Portal</Typography>
      <br />
      <Typography variant="h5" style={{ width: '70%' }}>
        Here it will be explained how to use the portal. Instructions on how to
        connect and claim the tokens, vesting mechanics explained, plus risk and
        warnings (be aware of the phishing sties etc)
      </Typography>
      <br />      
      <ClaimList />
    </Box>
  );
};
