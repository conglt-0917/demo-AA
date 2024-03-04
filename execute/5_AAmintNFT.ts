import { getEntryPoint, getPaymasterERC20, getPaymasterSponsor, getFactory, getNFT, getAccount } from '../config/contracts';
import {
    SimpleAccount,
    EntryPoint,
    TokenPaymaster,
    SimpleAccountFactory,
    SponsorPaymaster
} from '../typechain-types';
import {
    createAddress,
    getTokenBalance,
} from './utils';
import {
    fillAndSign,
} from './UserOp';
import { UserOperation } from './UserOperation';
import { accountOwner } from '../config/accounts';
import { contractAddress } from '../config/contracts';
import { Contract, utils } from 'ethers'
import nftABI from '../config/abiNFT.json'
import { abi as accountABI } from '../artifacts/contracts/samples/SimpleAccount.sol/SimpleAccount.json';
import { hexConcat, parseEther } from 'ethers/lib/utils';
import { hexValue } from '@ethersproject/bytes';
import { salt } from '../config/salt';

let entryPoint: EntryPoint = getEntryPoint();
let paymasterErc20: TokenPaymaster = getPaymasterERC20();
let paymasterSponsor: SponsorPaymaster = getPaymasterSponsor();
let factory: SimpleAccountFactory = getFactory();
let nft: Contract = getNFT();
let account: SimpleAccount = getAccount();

function getAccountDeployer(entryPoint: string, accountOwner: string, _salt: number = 0): string {
    return hexConcat([
        contractAddress.accountFactory,
        hexValue(factory.interface.encodeFunctionData('createAccount', [accountOwner, _salt])!)
    ])
}


async function main() {
    try {
        const data = nft.interface.encodeFunctionData('mint',
            [
                account.address,
                'https://bvhttdl.mediacdn.vn/2020/10/27/5-15875454604011998230042-16036836450041268704454-1603763865239-1603763866080171610522.jpg'
            ])

        const dataExec = account.interface.encodeFunctionData('execute', [contractAddress.nft, 0, data]);

        let createOp: UserOperation = await fillAndSign({
            initCode: getAccountDeployer(contractAddress.entryPoint, accountOwner.address, salt),
            //verificationGasLimit: 2e6,
            paymasterAndData: contractAddress.paymasterSponsor,
            nonce: 0,
            callGasLimit: 900000,
            preVerificationGas: 300000,
            verificationGasLimit: 838372,
            maxFeePerGas: 1575000024,
            maxPriorityFeePerGas: 1575000000,
            callData: dataExec
        }, accountOwner, entryPoint)

        // createOp.callData = dataExec;

        let beforeBalance = await getTokenBalance(paymasterErc20, account.address);
        console.log(`\nbalance ERC-20 of smart contract wallet before send Tx: ${beforeBalance}`);

        const tx = await entryPoint
            .handleOps([createOp], '0xdf37b2C1cf8cFB7d410B199DF70debAf7e620624', {
                gasLimit: 1e7,
            })
        await tx!.wait();

        let afterBalance = await getTokenBalance(paymasterErc20, account.address);
        console.log(`\n balance ERC-20 of smart contract wallet after send Tx: ${afterBalance}`);

        console.log(`\n Fee ERC-20 token: ${parseFloat(beforeBalance.toString()) - parseFloat(afterBalance.toString())}`);
    } catch (err) {
        console.log(err);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
