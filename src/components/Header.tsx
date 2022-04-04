/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useSession, useVesting, useWallet } from 'contexts';
import { checkAuthentication, getShortWalletAddress } from 'utils';
import { WalletType } from 'types';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '2rem',
    boxSizing: 'border-box',
  },
  flex: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menu: {
    display: 'flex',
    gap: '30px'
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    padding: '10px',
    fontWeight: 600,
  },
  signout: {
    color: theme.palette.text.primary,
    padding: '10px',
    fontWeight: 600,
    cursor: 'pointer'
  }
}));

export const Header = () => {
  const classes = useStyles();
  const { connected, account, connect, disconnect } = useWallet();
  const { getUsername, requestUserSignout } = useSession();
  const { isVestingAdmin } = useVesting();

  const userSignOut = () => {
    requestUserSignout()
    window.location.reload()
  }

  return (
    <Box className={clsx(classes.root, classes.flex)}>
      <Box mr="2rem" className={classes.menu}>
        <Link className={classes.link} to="/claiming">
          Claiming
        </Link>
        <Link className={classes.link} to="/staking">
          Staking
        </Link>
        {isVestingAdmin && (
          <Link className={classes.link} to="/admin">
            Admin
          </Link>
        )}
        {!checkAuthentication() && (
          <Link className={classes.link} to="/signin">
            Sign in
          </Link>
        )}
        {checkAuthentication() && (
          <div className={classes.signout} onClick={userSignOut}>
            Sign out
          </div>
        )}
      </Box>
      <Box className={classes.flex}>
        {checkAuthentication() && (
          <Typography variant="h6" style={{ marginRight: '1rem' }}>
            <b>{getUsername()}</b>
          </Typography>
        )}

        {connected ? (
          <div>
            <div>
              <b>{getShortWalletAddress(account || '')}</b>
            </div>
            <Button
              size="small"
              color="inherit"
              variant="outlined"
              style={{ height: 30 }}
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            color="primary"
            variant="contained"
            style={{ height: 50 }}
            onClick={() => connect(WalletType.MetaMask)}
          >
            Connect Wallet
          </Button>
        )}
      </Box>
    </Box>
  );
};
