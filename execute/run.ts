import { getEntryPoint, getFactory, getPaymaster, getAccount } from '../config/contracts';
import { parseEther } from 'ethers/lib/utils';
import {
  SimpleAccount,
  SimpleAccountFactory,
  EntryPoint,
  LegacyTokenPaymaster,
} from '../typechain-types';
import { ethers } from 'hardhat';
import {
  fund,
  rethrow,
  calcGasUsage,
  createAddress,
  getTokenBalance,
} from './utils';
import {
  fillAndSign,
  fillSignAndPack,
  packUserOp,
  simulateValidation,
} from './UserOp';
import { PackedUserOperation } from './UserOperation';
import { accountOwner } from '../config/accounts';
import { entryPointViem } from '../config/contracts';

let entryPoint: EntryPoint = getEntryPoint();
let factory: SimpleAccountFactory = getFactory();
let paymaster: LegacyTokenPaymaster = getPaymaster();
let account: SimpleAccount = getAccount();

async function main() {
 try {
   //await fund(account, '0.25');

   const sampleOp = await fillAndSign({ sender: account.address }, accountOwner, entryPoint);
   // const packedOp = packUserOp(sampleOp);
 
   // await entryPoint.depositTo(paymaster.address, { value: parseEther('0.1') });
   // await paymaster.addStake(1, { value: parseEther('0.1') });
 
   let createOp: PackedUserOperation = await fillSignAndPack(
     {
       sender: account.address,
       verificationGasLimit: 2e6,
       paymaster: paymaster.address,
       paymasterPostOpGasLimit: 3e5,
       nonce: 0,
     },
     accountOwner,
     entryPoint
   );
 
   //const preAddr = createOp.sender;
 
   //console.log(createOp);
 
   //await paymaster.mintTokens(preAddr, parseEther('1'));
 
   let beforeBalance = await getTokenBalance(paymaster, account.address);
   console.log(`\nbalance ERC-20 of smart contract wallet before send Tx: ${beforeBalance}`);
 
   //await simulateValidation(createOp, entryPoint.address, { gasLimit: 5e6 });
 
   const beneficiaryAddress = createAddress();
 
    const tx = await entryPoint
     .handleOps([createOp], beneficiaryAddress, {
       gasLimit: 5e7,
    })
    await tx!.wait();
 
   //await entryPointViem.write.handleOps([[createOp], beneficiaryAddress], {gasLimit: 4e7});
 
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
