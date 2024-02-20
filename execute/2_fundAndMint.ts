import { getEntryPoint, getFactory, getPaymaster, getAccount } from '../config/contracts';
import { parseEther } from 'ethers/lib/utils';
import {
    SimpleAccount,
    SimpleAccountFactory,
    EntryPoint,
    LegacyTokenPaymaster,
} from '../typechain-types';
import { fund, getTokenBalance } from './utils';

let entryPoint: EntryPoint = getEntryPoint();
let paymaster: LegacyTokenPaymaster = getPaymaster();
let account: SimpleAccount = getAccount();

async function main() {
    try {
        await fund(account, '0.25');

        await entryPoint.depositTo(paymaster.address, { value: parseEther('0.1') });
        await paymaster.addStake(1, { value: parseEther('0.1') });

        await paymaster.mintTokens(account.address, parseEther('1'));

        let balance = await getTokenBalance(paymaster, account.address);
        console.log(`\nbalance ERC-20 of smart contract wallet: ${balance}`);
    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
