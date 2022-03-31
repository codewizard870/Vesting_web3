import { Contract } from 'web3-eth-contract';

export interface IContract {
  contract: Contract;
  address: string;
}

export enum WalletType {
  MetaMask = 'metamask',
  WalletConnect = 'walletconnect',
}

export interface PoolInfo {
  stakeToken: string;
  rewardPerBlock: number;
  depositedAmount: number;
}

export interface UserInfo {
  amount: number;
  rewardDebt: number;
  pendingRewards: number;
}

export interface VestingType {
  typeId: number;
  name: string;
  startTime: number;
  endTime: number;
  lockupDuration: number;
  maxAmount: number;
  vestedAmount: number;
}

export interface VestingInfo {
  typeId: number;
  vestingId: number;
  recipient: string;
  amount: number;
  claimedAmount: number;
  lastClaim: number;
}

export interface VestingId {
  typeId: number;
  vestingId: number;
}

export interface VestingEvent {
  timestamp: number;
  topic: string;
}
