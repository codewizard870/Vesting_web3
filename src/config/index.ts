import tokenAbi from '../abi/Token.json';
import vestingAbi from '../abi/Vesting.json';
import stakingAbi from '../abi/Staking.json';

export enum ChainId {
  Mainnet = 1,  
  Rinkeby = 4
}

export const ABI = {
  tokenAbi,
  vestingAbi,
  stakingAbi
}

export const TokenAddress: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Rinkeby]: "0xaf5269eDca7021483e901E49D510b36630749B37"
}

export const VestingAddress: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Rinkeby]: "0x5c9D223Bca39c410088A89d1c50761B18dCB6f46"
}

export const StakingAddress: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "",
  [ChainId.Rinkeby]: "0x62cA1F093E8E4Be1F303E39b50A56691e6F2fCbf"
}

export const NetworkName: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "Ethereum Mainnet",
  [ChainId.Rinkeby]: "Rinkeby Testnet"
}

export const ProviderUrl: { [chainId in ChainId]?: string } = {
  [ChainId.Mainnet]: "https://mainnet.infura.io/v3/f8bdc9ea610d4e3d9f7d07c4d76bb08e",
  [ChainId.Rinkeby]: "https://rinkeby.infura.io/v3/f8bdc9ea610d4e3d9f7d07c4d76bb08e"
}

export const config = {
  networkId: ChainId.Rinkeby
}