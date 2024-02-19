import { getEntryPoint, getFactory, getPaymaster, getAccount } from '../config/contracts';

import { BigNumber, Event, Wallet } from 'ethers';
import { parseEther, hexConcat, hexValue } from 'ethers/lib/utils';
import {
  SimpleAccount,
  SimpleAccountFactory,
  TestAggregatedAccount__factory,
  TestAggregatedAccountFactory__factory,
  TestCounter,
  TestCounter__factory,
  TestExpirePaymaster,
  TestExpirePaymaster__factory,
  TestExpiryAccount,
  TestExpiryAccount__factory,
  TestPaymasterAcceptAll,
  TestPaymasterAcceptAll__factory,
  TestRevertAccount__factory,
  TestAggregatedAccount,
  TestSignatureAggregator,
  TestSignatureAggregator__factory,
  MaliciousAccount__factory,
  TestWarmColdAccount__factory,
  TestPaymasterRevertCustomError__factory,
  IEntryPoint__factory,
  SimpleAccountFactory__factory,
  IStakeManager__factory,
  INonceManager__factory,
  EntryPoint,
  LegacyTokenPaymaster,
  LegacyTokenPaymaster__factory,
} from '../typechain-types';
import { ethers } from 'hardhat';
import {
  AddressZero,
  createAccountOwner,
  fund,
  checkForGeth,
  rethrow,
  tostr,
  getAccountInitCode,
  calcGasUsage,
  ONE_ETH,
  TWO_ETH,
  deployEntryPoint,
  getBalance,
  createAddress,
  getAccountAddress,
  HashZero,
  createAccount,
  getAggregatedAccountInitCode,
  decodeRevertReason,
  getTokenBalance,
} from './utils';
import {
  DefaultsForUserOp,
  fillAndSign,
  fillSignAndPack,
  getUserOpHash,
  packUserOp,
  simulateValidation,
} from './UserOp';
import { PackedUserOperation } from './UserOperation';
import { accountOwner } from '../config/accounts';

let entryPoint: EntryPoint = getEntryPoint();
let factory: SimpleAccountFactory = getFactory();
let paymaster: LegacyTokenPaymaster = getPaymaster();
let account: SimpleAccount = getAccount();

async function main() {
  const ethersSigner = ethers.provider.getSigner();
  await fund(account, '0.2');

  const sampleOp = await fillAndSign({ sender: account.address }, accountOwner, entryPoint);
  const packedOp = packUserOp(sampleOp);

  console.log(`EntryPoint address: ${entryPoint.address}`);
  console.log(`Smart account wallet: ${account.address}`);
  console.log(`Owner of wallet is: ${accountOwner.address}`);
  console.log(`Factory is: ${factory.address}`);

  let pmAddr = paymaster.address;
  console.log(`Paymaster is\n: ${pmAddr}`);

  await entryPoint.depositTo(paymaster.address, { value: parseEther('0.1') });
  await paymaster.addStake(1, { value: parseEther('2') });

  let createOp: PackedUserOperation = await fillSignAndPack(
    {
      sender: account.address,
      //initCode: getAccountDeployer(factory, accountOwner.address, 3),
      verificationGasLimit: 2e6,
      paymaster: paymaster.address,
      paymasterPostOpGasLimit: 3e5,
      nonce: 0,
    },
    accountOwner,
    entryPoint
  );

  const preAddr = createOp.sender;

  // console.log(createOp);

  await paymaster.mintTokens(preAddr, parseEther('1'));

  let beforeBalance = await getTokenBalance(paymaster, account.address);
  console.log(`\nbalance ERC-20 of smart contract wallet before send Tx: ${beforeBalance}`);

  //await simulateValidation(createOp, entryPoint.address, { gasLimit: 5e6 });

  const beneficiaryAddress = createAddress();

  const rcpt = await entryPoint
    .handleOps([createOp], beneficiaryAddress, {
      gasLimit: 1e7,
    })
    .catch(rethrow())
    .then(async (tx) => await tx!.wait());
  console.log('\t== create gasUsed=', rcpt.gasUsed.toString());
  await calcGasUsage(rcpt, entryPoint);

  let afterBalance = await getTokenBalance(paymaster, account.address);
  console.log(`\n balance ERC-20 of smart contract wallet after send Tx: ${afterBalance}`);

  console.log(`\n Fee ERC-20 token: ${parseFloat(beforeBalance) - parseFloat(afterBalance)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
