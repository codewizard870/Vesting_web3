/* eslint-disable react-hooks/exhaustive-deps */
import { BigNumber } from 'ethers';
import { config, ABI } from 'config';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { PoolInfo, UserInfo } from 'types';
import { parseEther } from 'utils';
import { useContracts } from './contracts';
import { useWallet } from './wallets';

export interface IStakingContext {
  poolList: PoolInfo[];
  updatePoolList: () => void;
  getUserInfo: (pid: number) => Promise<Maybe<UserInfo>>;
  rewards: BigNumber[];
  deposit: (pid: number, amount: number) => Promise<boolean>;
  withdraw: (pid: number, amount: number) => Promise<boolean>;
  claim: (pid: number) => Promise<boolean>;
}

const StakingContext = React.createContext<Maybe<IStakingContext>>(null);

export const StakingProvider = ({ children = null as any }) => {
  const { stakingContract, web3 } = useContracts();
  const { account } = useWallet();

  const [poolList, setPoolList] = useState<PoolInfo[]>([]);
  const [rewards, setRewards] = useState<BigNumber[]>([]);

  const rewardTimer = useRef<NodeJS.Timeout | null>(null);

  const updatePoolList = async () => {
    let poolCount = 0;
    try {
      poolCount = await stakingContract.contract.methods.getPoolCount().call();
    } catch (e) {
      console.error('get pool count error:', e);
    }

    if (Number(poolCount) > 0) {
      const promises = new Array(Number(poolCount))
        .fill(0)
        .map((_, pid) => stakingContract.contract.methods.poolInfo(pid).call());
      try {
        await Promise.all(promises).then(async (res) => {
          setPoolList(
            res.map((item) => ({
              stakeToken: String(item[0]).toLowerCase(),
              rewardPerBlock: BigNumber.from(item[1]),
              depositedAmount: BigNumber.from(item[4]),
            }))
          );
        });
      } catch (e) {
        console.error('get pool list error:', e);
      }
    } else {
      setPoolList([]);
    }
  };

  const getUserInfo = async (pid: number) => {
    try {
      const res = await stakingContract.contract.methods
        .userInfo(pid, account)
        .call();

      return {
        amount: BigNumber.from(res[0]),
        rewardDebt: BigNumber.from(res[1]),
        pendingRewards: BigNumber.from(res[2]),
      } as UserInfo;
    } catch (e) {
      console.error('get user info error:', e);
    }

    return null;
  };

  const getPendingRewards = async (pid: number) => {
    try {
      const res = await stakingContract.contract.methods
        .pendingRewards(pid, account)
        .call();

      return BigNumber.from(res);
    } catch (e) {
      console.error('get user info error:', e);
    }

    return BigNumber.from(0);
  };

  const updatePendingRewards = async () => {
    const res = await Promise.all(
      poolList.map((_, pid) => getPendingRewards(pid))
    );
    setRewards(res);

    if (rewardTimer.current) {
      clearTimeout(rewardTimer.current);
    }
    rewardTimer.current = setTimeout(() => updatePendingRewards(), 10000);
  };

  useEffect(() => {
    if (poolList.length > 0) {
      updatePendingRewards();
    }
  }, [poolList.length]);

  const getAllowance = async (token: string) => {
    try {
      const tokenContract = new web3.eth.Contract(
        ABI.tokenAbi as any,
        token
      );
      const res = await tokenContract.methods
        .allowance(account, stakingContract.address)
        .call();
      return BigNumber.from(res);
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }

    return BigNumber.from(0);
  };

  const approve = async (token: string) => {
    const tokenContract = new web3.eth.Contract(ABI.tokenAbi as any, token);

    try {
      await tokenContract.methods
        .approve(
          stakingContract.address,
          '1000000000000000000000000000000000000000000000000000000'
        )
        .send({ from: account });
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  };

  const deposit = async (pid: number, amount: number) => {
    const value = parseEther(amount.toString(), undefined);
    const allowance = await getAllowance(poolList[pid].stakeToken);
    if (allowance.lt(value)) {
      await approve(poolList[pid].stakeToken);
    }

    try {
      await stakingContract.contract.methods
        .deposit(pid, 10)
        .send({ from: account });

      updatePoolList();

      toast.success('Deposited successfully');
      return true;
    } catch (err: any) {
      toast.error('Deposit error');
      console.error(err);
      return false;
    }
  };

  const withdraw = async (pid: number, amount: number) => {
    const value = parseEther(amount.toString(), undefined);

    try {
      await stakingContract.contract.methods
        .withdraw(pid, value)
        .send({ from: account });

      updatePoolList();

      toast.success('Withdrew successfully');
      return true;
    } catch (err: any) {
      toast.error('Withdraw error');
      console.error(err);
      return false;
    }
  };

  const claim = async (pid: number) => {
    try {
      await stakingContract.contract.methods.claim(pid).send({ from: account });

      updatePoolList();
      updatePendingRewards();

      toast.success('Claimed successfully');
      return true;
    } catch (err: any) {
      toast.error('Claim error');
      console.error(err);
      return false;
    }
  };

  return (
    <StakingContext.Provider
      value={{
        poolList,
        updatePoolList,
        getUserInfo,
        rewards,
        deposit,
        withdraw,
        claim,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};

export const useStaking = () => {
  const context = useContext(StakingContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};
