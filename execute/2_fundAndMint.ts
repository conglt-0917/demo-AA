import { getPaymaster, getAccount, getFactory } from '../config/contracts';
import {
    SimpleAccount,
    TokenPaymaster,
    SimpleAccountFactory
} from '../typechain-types';
import { fund, getTokenBalance } from './utils';
import { accountOwner } from '../config/accounts';

let paymaster: TokenPaymaster = getPaymaster();
let factory: SimpleAccountFactory = getFactory();

async function main() {
    try {
        
        const account = await factory.getAddress(accountOwner.address, 1712);
        console.log(account);
        await fund(account, '0.05');

        // await paymaster.faucet(account);

        // let balance = await getTokenBalance(paymaster, account);
        // console.log(`\nbalance ERC-20 of smart contract wallet: ${balance}`);
    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
