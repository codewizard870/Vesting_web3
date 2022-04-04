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
  vestingFrequencyId: number;
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

export const VF_LIST = [
  { value: 0, label: "Continuous" },
  { value: 1, label: "Daily" },
  { value: 2, label: "Weekly" },
  { value: 3, label: "Monthly" },
  { value: 4, label: "Quarterly" },
  { value: 5, label: "Yearly" },
]
