import { getPaymasterERC20, getPaymasterSponsor, getFactory } from '../config/contracts';
import {
    SimpleAccount,
    TokenPaymaster,
    SimpleAccountFactory,
    SponsorPaymaster
} from '../typechain-types';
import { fund, getTokenBalance, getBalance } from './utils';
import { accountOwner } from '../config/accounts';
import { salt } from '../config/salt';
import { parseEther } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

let paymasterErc20: TokenPaymaster = getPaymasterERC20();
let paymasterSponsor: SponsorPaymaster = getPaymasterSponsor();
let factory: SimpleAccountFactory = getFactory();

async function main() {
    try {
        const signer = ethers.provider.getSigner();
        const account = await factory.getAddress(accountOwner.address, salt);
        console.log(account);

        await paymasterErc20.faucet(account);

        let balance = await getTokenBalance(paymasterErc20, account);
        console.log(`\nbalance ERC-20 of smart contract wallet: ${balance}`);

        //await fund(paymasterSponsor.address as string);
        await signer.sendTransaction({ to: account, value: parseEther('1') })
        balance = await getBalance(account);
        console.log(`Balance ETH of smart contract wallet: ${balance}`);

    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
