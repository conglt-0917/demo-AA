import { getEntryPoint, getPaymaster, getAccount, getFactory } from '../config/contracts';
import {
  SimpleAccount,
  EntryPoint,
  TokenPaymaster,
  SimpleAccountFactory
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
import { hexConcat, parseEther } from 'ethers/lib/utils';
import { hexValue } from '@ethersproject/bytes';

let entryPoint: EntryPoint = getEntryPoint();
let paymaster: TokenPaymaster = getPaymaster();
// let account: SimpleAccount = getAccount();
let factory: SimpleAccountFactory = getFactory();

function getAccountDeployer(entryPoint: string, accountOwner: string, _salt: number = 0): string {
  return hexConcat([
    contractAddress.accountFactory,
    hexValue(factory.interface.encodeFunctionData('createAccount', [accountOwner, _salt])!)
  ])
}

async function main() {
  try {
    const account = await factory.getAddress(accountOwner.address, 1712);

    let createOp : UserOperation = await fillAndSign({
      initCode: getAccountDeployer(contractAddress.entryPoint, accountOwner.address, 1712),
      verificationGasLimit: 2e6,
      paymasterAndData: contractAddress.paymaster,
      nonce: 0
    }, accountOwner, entryPoint)

    console.log(createOp);

    let beforeBalance = await getTokenBalance(paymaster, account);
    console.log(`\nbalance ERC-20 of smart contract wallet before send Tx: ${beforeBalance}`);

    const beneficiaryAddress = createAddress();

    console.log({ beneficiaryAddress });

    const tx = await entryPoint
      .handleOps([createOp], beneficiaryAddress, {
        gasLimit: 1e7,
      })
    await tx!.wait();

    let afterBalance = await getTokenBalance(paymaster, account);
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
