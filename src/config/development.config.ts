import tokenAbi from '../abi/Token.json';
import vestingAbi from '../abi/Vesting.json';
import stakingAbi from '../abi/Staking.json';

const config = {
  tokenAbi,
  tokenAddress: '0x646bB72fD150af0Feb3C0BeB3548BC7e6f3d5fFC',
  vestingAbi,
  vestingAddress: '0xC1a9B70935Ab0C0E9133c737840851c10149315c',
  stakingAbi,
  stakingAddress: '0x62cA1F093E8E4Be1F303E39b50A56691e6F2fCbf',
  providerUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  networkId: 4,
  networkName: 'Rinkeby Testnet',
};

export default config;
