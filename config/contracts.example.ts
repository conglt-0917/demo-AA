import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import 'dotenv/config';
import { abi as entryPointABI } from '../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json';
import { abi as factoryABI } from '../artifacts/contracts/samples/SimpleAccountFactory.sol/SimpleAccountFactory.json';
import { abi as accountABI } from '../artifacts/contracts/samples/SimpleAccount.sol/SimpleAccount.json';
import { abi as paymasterABI } from '../artifacts/contracts/samples/TokenPaymaster.sol/TokenPaymaster.json';
import {
  SimpleAccount,
  SimpleAccountFactory,
  EntryPoint,
  TokenPaymaster,
} from '../typechain-types';

export const contractAddress = {
  entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' as `0x${string}`,
  accountFactory: '0x00004EC70002a32400f8ae005A26081065620D20' as `0x${string}`,
  simpleAccount: 'YOUR_ADDRESS_HERE' as `0x${string}`,
  paymaster: '0x0d849b3229E2852ce32b30e5e42C3FDaC4814819' as `0x${string}`,
};

const provider = ethers.provider;
const signer = provider.getSigner();

export const getEntryPoint = (): EntryPoint => {
  let instance = new Contract(contractAddress.entryPoint, entryPointABI, provider);
  instance = instance.connect(signer);
  return instance as EntryPoint;
};

export const getFactory = (): SimpleAccountFactory => {
  let instance = new Contract(contractAddress.accountFactory, factoryABI, provider);
  instance = instance.connect(signer);
  return instance as SimpleAccountFactory;
};

export const getPaymaster = (): TokenPaymaster => {
  let instance = new Contract(contractAddress.paymaster, paymasterABI, provider);
  instance = instance.connect(signer);
  return instance as TokenPaymaster;
};

export const getAccount = (): SimpleAccount => {
  let instance = new Contract(contractAddress.simpleAccount, accountABI, provider);
  instance = instance.connect(signer);
  return instance as SimpleAccount;
};
