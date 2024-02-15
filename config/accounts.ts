import 'dotenv/config';
import { ethers } from 'hardhat';
import { Wallet } from 'ethers';
const useTestNet = process.env.TEST_NET == 'true';
const privateKey = useTestNet ? process.env.PRIVATE_KEY : process.env.LOCALHOST_PRIVATE_KEY;

export const accountOwner: Wallet = new Wallet(privateKey as `0x${string}`, ethers.provider);
