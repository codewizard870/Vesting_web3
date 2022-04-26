import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { ToastContainer } from 'react-toastify'
import {
  ContractProvider,
  VestingProvider,
  WalletProvider,
  StakingProvider,
} from 'contexts'
import { Claim, Staking, Auth, Admin, Lend } from 'pages'
import { Header } from 'components'
import { Redirect, Route, Switch } from 'react-router-dom'
import { checkAuthentication } from 'utils'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from "./styles/theme"

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh'
  },
}))

function App() {
  const classes = useStyles()

  const getLibrary = (provider: any) => {
    const library = new Web3Provider(provider)
    library.pollingInterval = 8000
    return library
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContractProvider>
        <WalletProvider>
          <VestingProvider>
            <ThemeProvider theme={theme}>
              <main className={classes.root}>
                <div className="w-full bg-no-repeat md:bg-cover bg-center md:bg-[url('./assets/images/signup/hero.png')]" style={{ minHeight: '100vh' }}>
                  <div className="h-full w-full bg-[#F3F6FA] md:bg-[#FFFFFF]/70" style={{ minHeight: '100vh' }}>
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
                        <Route path="/lend" component={Lend} />
                        <Redirect to="/staking" />
                      </Switch>
                    ) : (
                      <Switch>
                        <Route path="/Auth" component={Auth} />
                        <Route path="/signup" component={Auth} />
                        <Redirect to="/Auth" />
                      </Switch>
                    )}
                  </div>
                </div>
                <ToastContainer />
              </main>
            </ThemeProvider>
          </VestingProvider>
        </WalletProvider>
      </ContractProvider>
    </Web3ReactProvider>
  )
}

export default App
