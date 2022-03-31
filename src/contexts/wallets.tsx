/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import config from '../config';
import { WalletType } from 'types';
import { useLocalStorageState } from 'hooks';
import { useContracts } from './contracts';

export interface IWalletContext {
  connected: boolean;
  account: Maybe<string>;
  balance: number;
  tokenBalance: number;
  chainId: Maybe<number>;
  connect: (type: WalletType) => void;
  disconnect: () => void;
  updateBalance: () => void;
  updateTokenBalance: () => void;
  getTokenBalance: (
    userAddress: string,
    tokenAddress: string
  ) => Promise<number>;
}

export const metamaskInjected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [5],
  rpc: {
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 12000,
});

const WalletContext = React.createContext<Maybe<IWalletContext>>(null);

export const WalletProvider = ({ children = null as any }) => {
  const { web3 } = useContracts();
  const { activate, deactivate, active, chainId, account } = useWeb3React();

  const [walletType, setWalletType] = useLocalStorageState('wallet_type', '');
  const [connected, setConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  const connect = useCallback(
    async (type: WalletType = WalletType.MetaMask) => {
      try {
        if (type === WalletType.MetaMask) {
          await activate(metamaskInjected);
        } else if (type === WalletType.WalletConnect) {
          await activate(walletconnect);
        }
        setWalletType(type.toString());
      } catch (err) {
        toast.error('Wallet connect failed!');
      }
    },
    [activate, setWalletType]
  );

  const disconnect = async () => {
    await deactivate();
    setWalletType(null);
  };

  useEffect(() => {
    if (walletType) {
      if (walletType === 'metamask') {
        connect(WalletType.MetaMask);
      } else if (walletType === 'walletconnect') {
        connect(WalletType.WalletConnect);
      }
    }
  }, [connect, activate, walletType]);

  useEffect(() => {
    if (active) {
      if (chainId) {
        if (chainId === config.networkId) {
          setConnected(true);
        } else {
          deactivate();
          toast.error(`Please connect ${config.networkName}!`);
        }
      }
    } else {
      setConnected(false);
    }
  }, [active, chainId, deactivate]);

  const updateBalance = useCallback(async () => {
    if (account) {
      const res = await web3.eth.getBalance(account);
      setBalance(Number(web3.utils.fromWei(res)));
    } else {
      setBalance(0);
    }
  }, [account]);

  const updateTokenBalance = useCallback(async () => {
    if (account) {
      const tokenContract = new web3.eth.Contract(
        config.tokenAbi as any,
        config.tokenAddress
      );

      try {
        const res = await tokenContract.methods.balanceOf(account).call();
        setTokenBalance(Math.floor(Number(web3.utils.fromWei(res))));
      } catch (err: any) {
        console.error(err);
      }
    } else {
      setTokenBalance(0);
    }
  }, [account]);

  useEffect(() => {
    updateBalance();
    updateTokenBalance();
  }, [account]);

  const getTokenBalance = async (userAddress: string, tokenAddress: string) => {
    const tokenContract = new web3.eth.Contract(
      config.tokenAbi as any,
      tokenAddress
    );

    try {
      const res = await tokenContract.methods.balanceOf(userAddress).call();
      return Math.floor(Number(web3.utils.fromWei(res)));
    } catch (err: any) {
      console.error(err);
    }
    return 0;
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        account,
        balance,
        tokenBalance,
        chainId,
        connect,
        disconnect,
        updateBalance,
        updateTokenBalance,
        getTokenBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};
