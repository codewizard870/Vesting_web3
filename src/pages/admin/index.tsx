import React, { useEffect, useState } from 'react';
import { useVesting } from 'contexts';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { Vesting } from './Vesting';
import { VestingTypes } from './VestingTypes';
import { Box, makeStyles, Tab, Tabs } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '2rem',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  content: {
    width: '100%',
  },
}));

export const Admin = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const { isVestingAdmin } = useVesting();

  const [tabValue, setTabValue] = useState('0');

  if (!isVestingAdmin) {
    return <Redirect to="/" />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (location.pathname === '/admin/vesting') {
      setTabValue('0');
    } else {
      setTabValue('1');
    }
  }, [location.pathname]);

  const handleTabChange = (_: any, value: string) => {
    if (value === '0') {
      history.push('/admin/vesting');
    } else {
      history.push('/admin/vesting_type');
    }
  };

  return (
    <Box className={classes.root}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab value="0" label="Wallet List" />
        <Tab value="1" label="Vesting Types" />
      </Tabs>

      <Box className={classes.content}>
        <Switch>
          <Route path="/admin/vesting_type" component={VestingTypes} />
          <Route path="/admin/vesting" component={Vesting} />
          <Redirect to="/admin/vesting" />
        </Switch>
      </Box>
    </Box>
  );
};
