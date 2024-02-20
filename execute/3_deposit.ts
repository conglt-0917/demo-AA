import { getEntryPoint, getPaymaster } from '../config/contracts';
import { parseEther } from 'ethers/lib/utils';
import {
    EntryPoint,
    LegacyTokenPaymaster,
} from '../typechain-types';

let entryPoint: EntryPoint = getEntryPoint();
let paymaster: LegacyTokenPaymaster = getPaymaster();

async function main() {
    try {
        await entryPoint.depositTo(paymaster.address, { value: parseEther('0.1') });
        await paymaster.addStake(1, { value: parseEther('0.1') });
    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
