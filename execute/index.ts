import {
    getVersion060EntryPoint,
    toSmartContractAccount,
} from "@alchemy/aa-core";
import { polygonMumbai } from "viem/chains";
import { getEntryPoint, getPaymasterERC20, getPaymasterSponsor, getFactory } from '../config/contracts';
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
    getBalance
} from './utils';
import {
    fillAndSign,
} from './UserOp';
import { UserOperation } from './UserOperation';
import { accountOwner } from '../config/accounts';
import { contractAddress } from '../config/contracts';
import { hexConcat, parseEther } from 'ethers/lib/utils';
import { hexValue } from '@ethersproject/bytes';
import { salt } from '../config/salt';

let factory: SimpleAccountFactory = getFactory();
let entryPoint: EntryPoint = getEntryPoint();

const factoryAddress = '0x0B42707A8fD08093c09Eb4378BE9A0d063f0193f';
const callData = ''

function getAccountDeployer(entryPoint: string, accountOwner: string, _salt: number = 0): string {
    return hexConcat([
        factoryAddress,
        hexValue(factory.interface.encodeFunctionData('createAccount', [accountOwner, _salt])!)
    ])
}

async function main() {
    try {
        const myAccount = await toSmartContractAccount({
            /// REQUIRED PARAMS ///
            source: "MyAccount",
            //transport: http("https://polygon-mumbai-bor.publicnode.com"),
            chain: polygonMumbai,
            // The EntryPointDef that your account is compatible with
            entryPoint: getVersion060EntryPoint(polygonMumbai),
            // This should return a concatenation of your `factoryAddress` and the `callData` for your factory's create account method
            getAccountInitCode: () => getAccountDeployer(entryPoint, accountOwner, salt),
            // an invalid signature that doesn't cause your account to revert during validation
            getDummySignature: () => "0x1234...",
            // given a UO in the form of {target, data, value} should output the calldata for calling your contract's execution method
            encodeExecute: (uo) => "...."
            signMessage: ({ message }: SignableMessage) => "0x...",
            signTypedData: (typedData) => "0x000",
        });
    } catch (err) {
        console.log({ err });
    }
}

main();
