import { getEntryPoint, getPaymasterERC20, getPaymasterSponsor } from '../config/contracts';
import { parseEther } from 'ethers/lib/utils';
import {
    EntryPoint,
    TokenPaymaster,
    SponsorPaymaster
} from '../typechain-types';
import { contractAddress } from '../config/contracts';
import { accountOwner } from '../config/accounts';
import { ethers } from 'hardhat';
let entryPoint: EntryPoint = getEntryPoint();
let paymasterErc20: TokenPaymaster = getPaymasterERC20();
let paymasterSponsor: SponsorPaymaster = getPaymasterSponsor();

async function main() {
    try {
        // await entryPoint.depositTo(contractAddress.paymasterErc20, { value: parseEther('0.5') });
        // await paymasterErc20.addStake(1, { value: parseEther('0.5') });

        // await entryPoint.depositTo(contractAddress.paymasterSponsor, { value: parseEther('0.5') });
        // await paymasterSponsor.addStake(1, { value: parseEther('0.5') });

        console.log(ethers.utils.formatEther((await entryPoint.getDepositInfo(paymasterSponsor.address)).deposit));
    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
