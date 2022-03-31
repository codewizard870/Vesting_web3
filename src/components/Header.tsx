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
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    padding: '10px',
    fontWeight: 600,
  },
}));

export const Header = () => {
  const classes = useStyles();
  const { connected, account, connect } = useWallet();
  const { getUsername } = useSession();
  const { isVestingAdmin } = useVesting();

  return (
    <Box className={clsx(classes.root, classes.flex)}>
      <Box mr="2rem">
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
      </Box>
      <Box className={classes.flex}>
        {checkAuthentication() && (
          <Typography variant="h6" style={{ marginRight: '1rem' }}>
            <b>{getUsername()}</b>
          </Typography>
        )}

        {connected ? (
          <Typography variant="h6">
            <b>{getShortWalletAddress(account || '')}</b>
          </Typography>
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
