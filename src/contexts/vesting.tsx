/* eslint-disable react-hooks/exhaustive-deps */
import { BigNumber } from 'ethers';
import React, { useEffect, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { VestingEvent, VestingInfo, VestingType } from 'types';
import { useContracts } from './contracts';
import { useWallet } from './wallets';
import { parseEther } from 'utils'
export interface IVestingContext {
  isVestingAdmin: boolean;
  vestingTypes: VestingType[];
  vestingList: VestingInfo[];
  claim: (vestingId: number) => void;
  getClaimAvailable: (vestingId: number) => Promise<BigNumber>;
  getVestingFrequency: (vfId: number) => Promise<number>;
  addVestingType: (
    name: string,
    start: number,
    end: number,
    lockupDuration: number,
    maxAmount: number,
    vestingFrequencyId: number
  ) => Promise<boolean>;
  updateVestingType: (
    typeId: number,
    name: string,
    start: number,
    end: number,
    lockupDuration: number,
    maxAmount: number,
    vestingFrequencyId: number
  ) => Promise<boolean>;
  addVesting: (
    typeId: number,
    recipient: string,
    amount: number
  ) => Promise<boolean>;
  updateVesting: (
    vestingId: number,
    recipient: string,
    amount: number
  ) => Promise<boolean>;
  getEvents: (typeId: number, vestingId: number) => Promise<VestingEvent[]>;
  eventTopics: { [id: string]: string };
}

const VestingContext = React.createContext<Maybe<IVestingContext>>(null);

export const VestingProvider = ({ children = null as any }) => {
  const { vestingContract, web3 } = useContracts();
  const { account } = useWallet();

  const [isVestingAdmin, setVestingAdmin] = useState(false);
  const [vestingTypes, setVestingTypes] = useState<VestingType[]>([]);
  const [vestingList, setVestingList] = useState<VestingInfo[]>([]);

  const eventTopics: { [id: string]: string } = {
    '0x93bc517d3a1f371c54891e26d1ffb7121f65b7072f6cbe83fdfbcb5feacf061c':
      'Add Vesting',
    '0xe6d694b54788342dc8b6604e48740e3abe4ab8802d6e2aa394358f327abe974b':
      'Remove Vesting',
  };

  useEffect(() => {
    updateAdminInfo();
    updateVestingTypes();
    updateVestingList();
  }, [account]);

  const updateAdminInfo = async () => {
    if (account) {
      try {
        const res = await vestingContract.contract.methods
          .isAdmin(account)
          .call();
        setVestingAdmin(res);
      } catch (err) {
        console.error(err);
        setVestingAdmin(false);
      }
    } else {
      setVestingAdmin(false);
    }
  };

  const updateVestingTypes = async () => {
    let typeCount = 0;
    try {
      typeCount = await vestingContract.contract.methods.typeCount().call();
    } catch (err) {
      console.error(err);
    }

    if (Number(typeCount) > 0) {
      const promises = new Array(Number(typeCount))
        .fill(0)
        .map((_, typeId) =>
          vestingContract.contract.methods.typeList(typeId).call()
        );
      try {
        await Promise.all(promises).then(async (res) => {
          setVestingTypes(
            res.map((item, typeId) => ({
              typeId,
              name: String(item[0]),
              startTime: Number(item[1]),
              endTime: Number(item[2]),
              lockupDuration: Number(item[3]),
              maxAmount: BigNumber.from(item[4]),
              vestedAmount: BigNumber.from(item[5]),
              vestingFrequencyId: Number(item[6])
            }))
          );
        });
      } catch (e) {
        console.error('get vesting type error:', e);
      }
    } else {
      setVestingTypes([]);
    }
  };

  const updateVestingList = async () => {
    let vestingCount = 0;
    try {
      vestingCount = await vestingContract.contract.methods
        .vestingCount()
        .call();
    } catch (err) {
      console.error(err);
    }

    if (Number(vestingCount) > 0) {
      const promises = new Array(Number(vestingCount))
        .fill(0)
        .map((_, vestingId) =>
          vestingContract.contract.methods.vestingList(vestingId).call()
        );
      try {
        const res = await Promise.all(promises);
        setVestingList(
          res.map(
            (item, vestingId) =>
            ({
              typeId: Number(item[0]),
              vestingId,
              recipient: String(item[1]).toLowerCase(),
              amount: BigNumber.from(item[2]),
              claimedAmount: BigNumber.from(item[3]),
              lastClaim: Number(item[4]),
            } as VestingInfo)
          )
        );
      } catch (e) {
        console.error('get vesting list error:', e);
        setVestingList([]);
      }
    } else {
      setVestingList([]);
    }
  };

  const claim = async (vestingId: number) => {
    try {
      await vestingContract.contract.methods
        .claim(vestingId)
        .send({ from: account });
      toast.success('Claimed successfully');
      updateVestingList();
    } catch (err) {
      console.error(err);
      toast.error('Error happened');
    }
  };

  const getClaimAvailable = async (vestingId: number) => {
    try {
      const res = await vestingContract.contract.methods
        .claimAvailable(vestingId)
        .call();
      return BigNumber.from(res);
    } catch (err) {
      console.error(err);
    }
    return BigNumber.from(0);
  };

  const getVestingFrequency = async (vfId: number) => {
    try {
      const res = await vestingContract.contract.methods
        .vestingFrequencyList(vfId)
        .call();
      return Number(res);
    } catch (err) {
      console.error(err);
    }
    return 0;
  };

  const addVestingType = async (
    name: string,
    start: number,
    end: number,
    lockupDuration: number,
    maxAmount: number,
    vestingFrequencyId: number
  ) => {
    try {
      await vestingContract.contract.methods
        .addVestingType(
          name,
          start,
          end,
          lockupDuration,
          parseEther(maxAmount.toString(), undefined),
          vestingFrequencyId
        )
        .send({ from: account });
      toast.success('Added successfully');
      updateVestingTypes();
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Error happened');
    }
    return false;
  };

  const updateVestingType = async (
    typeId: number,
    name: string,
    start: number,
    end: number,
    lockupDuration: number,
    maxAmount: number,
    vestingFrequencyId: number
  ) => {
    try {
      await vestingContract.contract.methods
        .updateVestingType(
          typeId,
          name,
          start,
          end,
          lockupDuration,
          parseEther(maxAmount.toString(), undefined),
          vestingFrequencyId
        )
        .send({ from: account });
      toast.success('Updated successfully');
      updateVestingTypes();
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Error happened');
    }
    return false;
  };

  const addVesting = async (
    typeId: number,
    recipient: string,
    amount: number
  ) => {
    try {
      await vestingContract.contract.methods
        .addVesting(typeId, recipient, parseEther(amount.toString(), undefined),)
        .send({ from: account });
      toast.success('Added successfully');
      updateVestingTypes();
      updateVestingList();
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Error happened');
    }
    return false;
  };

  const updateVesting = async (
    vestingId: number,
    recipient: string,
    amount: number
  ) => {
    try {
      await vestingContract.contract.methods
        .updateVesting(vestingId, recipient, parseEther(amount.toString(), undefined))
        .send({ from: account });
      toast.success('Updated successfully');
      updateVestingTypes();
      updateVestingList();
      return true;
    } catch (err) {
      console.error(err);
      toast.error('Error happened');
    }
    return false;
  };

  const getEvents = async (vestingId: number) => {
    let events: VestingEvent[] = [];

    let vestingIdHex = web3.utils.toHex(vestingId);
    vestingIdHex = web3.utils.padLeft(vestingIdHex, 67 - vestingIdHex.length);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_ETHERSCAN_URL
        }?module=logs&action=getLogs&fromBlock=${10389525}&toBlock=latest&address=${vestingContract.address
        }&topic1=${vestingIdHex}&apikey=${process.env.REACT_APP_ETHERSCAN_API}`
      ).then((res) => res.json());
      if (res && res.status === '1') {
        events = res.result.map(
          (item: any) =>
          ({
            timestamp: web3.utils.hexToNumber(item.timeStamp),
            topic: item.topics[0],
          } as VestingEvent)
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Get Events Error');
    }

    return events;
  };

  return (
    <VestingContext.Provider
      value={{
        isVestingAdmin,
        vestingTypes,
        vestingList,
        claim,
        getClaimAvailable,
        getVestingFrequency,
        addVestingType,
        updateVestingType,
        addVesting,
        updateVesting,
        getEvents,
        eventTopics,
      }}
    >
      {children}
    </VestingContext.Provider>
  );
};

export const useVesting = () => {
  const context = useContext(VestingContext);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};
