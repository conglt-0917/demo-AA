import { ethers } from 'hardhat';
import { getPaymaster } from './config/contracts';
import {
    SimpleAccount,
    SimpleAccountFactory,
    EntryPoint,
    LegacyTokenPaymaster__factory,
    LegacyTokenPaymaster,
    EntryPoint__factory,
    IEntryPoint
} from './typechain-types';
import { BigNumber } from 'ethers';

const provider = ethers.provider;
let paymaster: LegacyTokenPaymaster = getPaymaster();

async function main() {
    console.log(await paymaster.balanceOf(paymaster.address))
    await paymaster.transfer('0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', BigNumber.from('2'));
}

main();
