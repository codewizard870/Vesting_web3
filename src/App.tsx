import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ToastContainer } from 'react-toastify';
import {
  ContractProvider,
  VestingProvider,
  WalletProvider,
  StakingProvider,
} from 'contexts';
import { Claim, Staking, Signin, Signup, Admin } from 'pages';
import { Header } from 'components';
import { Redirect, Route, Switch } from 'react-router-dom';
import { checkAuthentication } from 'utils';

import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    fontFamily: 'Poppins',
  },
}));

function App() {
  const classes = useStyles();

  const getLibrary = (provider: any) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContractProvider>
        <WalletProvider>
          <VestingProvider>
            <main className={classes.root}>
              {checkAuthentication() && <Header />}

              {checkAuthentication() ? (
                <Switch>
                  <Route path="/admin" component={Admin} />
                  <Route path="/claiming" component={Claim} />
                  <Route path="/staking">
                    <StakingProvider>
                      <Staking />
                    </StakingProvider>
                  </Route>
                  <Redirect to="/claiming" />
                </Switch>
              ) : (
                <Switch>
                  <Route path="/signin" component={Signin} />
                  <Route path="/signup" component={Signup} />
                  <Redirect to="/signin" />
                </Switch>
              )}
              <ToastContainer />
            </main>
          </VestingProvider>
        </WalletProvider>
      </ContractProvider>
    </Web3ReactProvider>
  );
}

export default App;
