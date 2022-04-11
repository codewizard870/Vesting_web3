/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useStaking } from 'contexts';
import { StakingPool } from './StakingPool';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  progress: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

export const StakingView = () => {
  const classes = useStyles();
  const { poolList, updatePoolList } = useStaking();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetch = async () =>{
      await updatePoolList();
      setIsLoading(false)
    }
    fetch()
  }, []);
  
  return (
    <div>
      {!isLoading ?
        <Box className={clsx(classes.root, classes.flex)}>
          {poolList.map((poolInfo, pid) => (
            <StakingPool poolInfo={poolInfo} pid={pid} key={pid} />
          ))}
        </Box> :
        <div className={classes.progress}>
          <CircularProgress />
        </div>}
    </div>
  );
};
