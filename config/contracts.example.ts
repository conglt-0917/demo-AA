import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import 'dotenv/config';
import { abi as entryPointABI } from '../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json';
import { abi as factoryABI } from '../artifacts/contracts/samples/SimpleAccountFactory.sol/SimpleAccountFactory.json';
import { abi as accountABI } from '../artifacts/contracts/samples/SimpleAccount.sol/SimpleAccount.json';
import { abi as paymasterERC20ABI } from '../artifacts/contracts/samples/TokenPaymaster.sol/TokenPaymaster.json';
import { abi as paymasterSponsorABI } from '../artifacts/contracts/samples/SponsorPaymaster.sol/SponsorPaymaster.json';
import nftABI from './abiNFT.json';
import {
  SimpleAccount,
  SimpleAccountFactory,
  EntryPoint,
  TokenPaymaster,
  SponsorPaymaster
} from '../typechain-types';


export const contractAddress = {
  entryPoint: '' as `0x${string}`,
  accountFactory: '' as `0x${string}`,
  simpleAccount: '' as `0x${string}`,
  paymasterErc20: '' as `0x${string}`,
  paymasterSponsor: '' as `0x${string}`,
  nft: '' as `0x${string}`
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

export const getPaymasterERC20 = (): TokenPaymaster => {
  let instance = new Contract(contractAddress.paymasterErc20, paymasterERC20ABI, provider);
  instance = instance.connect(signer);
  return instance as TokenPaymaster;
};

export const getPaymasterSponsor = (): SponsorPaymaster => {
  let instance = new Contract(contractAddress.paymasterSponsor, paymasterSponsorABI, provider);
  instance = instance.connect(signer);
  return instance as SponsorPaymaster;
};

export const getNFT = (): Contract => {
  let instance = new Contract(contractAddress.nft, nftABI, provider);
  instance = instance.connect(signer);
  return instance;
};

export const getAccount = (): SimpleAccount => {
  let instance = new Contract(contractAddress.simpleAccount, accountABI, provider);
  instance = instance.connect(signer);
  return instance as SimpleAccount;
};
