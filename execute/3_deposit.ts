import { getEntryPoint, getPaymaster } from '../config/contracts';
import { parseEther } from 'ethers/lib/utils';
import {
    EntryPoint,
    TokenPaymaster,
} from '../typechain-types';
import { contractAddress } from '../config/contracts';

let entryPoint: EntryPoint = getEntryPoint();
let paymaster: TokenPaymaster = getPaymaster();

async function main() {
    try {
        await entryPoint.depositTo(contractAddress.paymaster, { value: parseEther('0.05') });
        //await paymaster.addStake(1, { value: parseEther('0.1') });
    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
