/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AddVestingType } from './AddVestingType';
import { VestingTypeTable } from './VestingTypeTable';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '2rem',
    boxSizing: 'border-box',
  },
}));

export const VestingTypes = () => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root)}>
      <Switch>
        <Route path="/admin/vesting_type/add" component={AddVestingType} />
        <Route path="/admin/vesting_type/edit/:id">
          <AddVestingType edit />
        </Route>
        <Route path="/admin/vesting_type" component={VestingTypeTable} />
        <Redirect to="/admin/vesting_type" />
      </Switch>
    </Box>
  );
};
