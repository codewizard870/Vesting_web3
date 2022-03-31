import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import config from 'config';
import { IContract } from 'types';
import { Contract } from 'web3-eth-contract';

export interface IContractContext {
  web3: Web3;
  tokenContract: IContract;
  vestingContract: IContract;
  stakingContract: IContract;
}

const ContractContext = React.createContext<Maybe<IContractContext>>(null);

const defaultWeb3 = new Web3((window as any).ethereum || config.providerUrl);

export const ContractProvider = ({ children = null as any }) => {
  const { library } = useWeb3React();

  const [web3, setWeb3] = useState<Web3>(defaultWeb3);
  const [tokenContract, setTokenContract] = useState<Contract>(
    new defaultWeb3.eth.Contract(config.tokenAbi as any, config.tokenAddress)
  );
  const [vestingContract, setVestingContract] = useState<Contract>(
    new defaultWeb3.eth.Contract(
      config.vestingAbi as any,
      config.vestingAddress
    )
  );
  const [stakingContract, setStakingContract] = useState<Contract>(
    new defaultWeb3.eth.Contract(
      config.stakingAbi as any,
      config.stakingAddress
    )
  );

  useEffect(() => {
    const web3Obj = new Web3(library?.provider || config.providerUrl);
    setWeb3(web3Obj);
    setTokenContract(
      new web3Obj.eth.Contract(config.tokenAbi as any, config.tokenAddress)
    );
    setVestingContract(
      new web3Obj.eth.Contract(config.vestingAbi as any, config.vestingAddress)
    );
    setStakingContract(
      new web3Obj.eth.Contract(config.stakingAbi as any, config.stakingAddress)
    );
  }, [library]);

  return (
    <ContractContext.Provider
      value={{
        web3,
        tokenContract: {
          contract: tokenContract,
          address: config.tokenAddress,
        },
        vestingContract: {
          contract: vestingContract,
          address: config.vestingAddress,
        },
        stakingContract: {
          contract: stakingContract,
          address: config.stakingAddress,
        },
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};
