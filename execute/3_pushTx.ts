import { getEntryPoint, getPaymaster, getAccount } from '../config/contracts';
import {
  SimpleAccount,
  EntryPoint,
  LegacyTokenPaymaster,
} from '../typechain-types';
import {
  createAddress,
  getTokenBalance,
} from './utils';
import {
  fillSignAndPack,
} from './UserOp';
import { PackedUserOperation } from './UserOperation';
import { accountOwner } from '../config/accounts';
import { ethers } from 'hardhat';

let entryPoint: EntryPoint = getEntryPoint();
let paymaster: LegacyTokenPaymaster = getPaymaster();
let account: SimpleAccount = getAccount();

async function main() {
  try {
    const nonce = await ethers.provider.getTransactionCount(account.address);

    let createOp: PackedUserOperation = await fillSignAndPack(
      {
        sender: account.address,
        verificationGasLimit: 2e6,
        paymaster: paymaster.address,
        paymasterPostOpGasLimit: 3e5,
        nonce,
      },
      accountOwner,
      entryPoint
    );

    //console.log(createOp);

    let beforeBalance = await getTokenBalance(paymaster, account.address);
    console.log(`\nbalance ERC-20 of smart contract wallet before send Tx: ${beforeBalance}`);

    const beneficiaryAddress = createAddress();

    console.log({ beneficiaryAddress });

    const tx = await entryPoint
      .handleOps([createOp], beneficiaryAddress, {
        gasLimit: 1e7,
      })
    await tx!.wait();

    let afterBalance = await getTokenBalance(paymaster, account.address);
    console.log(`\n balance ERC-20 of smart contract wallet after send Tx: ${afterBalance}`);

    console.log(`\n Fee ERC-20 token: ${parseFloat(beforeBalance) - parseFloat(afterBalance)}`);
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
