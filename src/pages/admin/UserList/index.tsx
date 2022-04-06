/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Redirect, Route, Switch } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '2rem',
    boxSizing: 'border-box',
  },
}));

export const UserList = () => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root)}>
      
    </Box>
  );
};
