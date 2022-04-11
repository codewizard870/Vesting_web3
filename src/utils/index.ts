import BigNumber from 'bignumber.js';
import jwt from 'jsonwebtoken';

export const getShortWalletAddress = (account: string) => {
  return `${account.slice(0, 6)}...${account.slice(-4)}`;
};

export const bnToDec = (bn: BigNumber, decimals: number = 18, fixed: number = 0) => {
  let res:BigNumber = bn.dividedBy(new BigNumber(10).pow(decimals));  
  return Math.floor(res.toNumber()*(10**fixed))/(10**fixed)
};

export const decToBn = (dec: number, decimals: number = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

export const checkAuthentication = () => {
  const authorizationToken = localStorage.getItem('jwtToken');  
  if (authorizationToken == null) {
    return false;
  }
  try {
    let token=jwt.decode(authorizationToken);
    if (token) return true;
    else return false;
  } catch (err) {
    return false;
  }
};

export function formatTime(value: number) {
  const mins = Math.round(value / 60);
  const hours = Math.round(mins / 60);
  const days = Math.round(hours / 24);
  if (days > 0) {
    return `${days} day(s)`;
  }
  if (hours > 0) {
    return `${hours} hour(s)`;
  }
  if (mins > 0) {
    return `${mins} min(s)`;
  }
  if (value > 0) {
    return `${value} sec(s)`;
  }
  return '0 days';
}
