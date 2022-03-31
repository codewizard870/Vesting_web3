import tokenAbi from '../abi/Token.json';
import vestingAbi from '../abi/Vesting.json';
import stakingAbi from '../abi/Staking.json';

const config = {
  tokenAbi,
  tokenAddress: '0xb00f1f831261FbeaEE98f5D3EbB22EcC3c7726A5',
  vestingAbi,
  vestingAddress: '0xFb3077B6c1ba609B70fE55Fa924772253FBE9098',
  stakingAbi,
  stakingAddress: '0x62cA1F093E8E4Be1F303E39b50A56691e6F2fCbf',
  providerUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  networkId: 4,
  networkName: 'Rinkeby Testnet',
};

export default config;
