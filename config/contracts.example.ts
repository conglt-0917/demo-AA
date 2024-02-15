import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import 'dotenv/config';
import { abi as entryPointABI } from '../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json';
import { abi as factoryABI } from '../artifacts/contracts/samples/SimpleAccountFactory.sol/SimpleAccountFactory.json';
import { abi as accountABI } from '../artifacts/contracts/samples/SimpleAccount.sol/SimpleAccount.json';
import { abi as paymasterABI } from '../artifacts/contracts/samples/LegacyTokenPaymaster.sol/LegacyTokenPaymaster.json';
import {
  SimpleAccount,
  SimpleAccountFactory,
  EntryPoint,
  LegacyTokenPaymaster,
} from '../typechain-types';

export const contractAddress = {
  entryPoint: 'YOUR_ADDRESS_HERE' as `0x${string}`,
  accountFactory: 'YOUR_ADDRESS_HERE' as `0x${string}`,
  simpleAccount: 'YOUR_ADDRESS_HERE' as `0x${string}`,
  paymaster: 'YOUR_ADDRESS_HERE' as `0x${string}`,
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

export const getPaymaster = (): LegacyTokenPaymaster => {
  let instance = new Contract(contractAddress.paymaster, paymasterABI, provider);
  instance = instance.connect(signer);
  return instance as LegacyTokenPaymaster;
};

export const getAccount = (): SimpleAccount => {
  let instance = new Contract(contractAddress.simpleAccount, accountABI, provider);
  instance = instance.connect(signer);
  return instance as SimpleAccount;
};
