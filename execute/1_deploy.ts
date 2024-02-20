import {
  SimpleAccount,
  SimpleAccountFactory,
  EntryPoint,
  LegacyTokenPaymaster__factory,
  LegacyTokenPaymaster,
} from '../typechain-types';
import { ethers } from 'hardhat';
import { deployEntryPoint, createAccount } from './utils';
import { accountOwner } from '../config/accounts';

let entryPoint: EntryPoint;
let factory: SimpleAccountFactory;
let paymaster: LegacyTokenPaymaster;
let account: SimpleAccount;

async function main() {
  const ethersSigner = ethers.provider.getSigner();

  entryPoint = await deployEntryPoint();

  ({ proxy: account, accountFactory: factory } = await createAccount(
    ethersSigner,
    await accountOwner.getAddress(),
    entryPoint.address
  ));

  paymaster = await new LegacyTokenPaymaster__factory(ethersSigner).deploy(
    factory.address,
    'USDT',
    entryPoint.address
  );
  let pmAddr = paymaster.address;

  console.log(`Paymaster address is: ${pmAddr}`);
  console.log(`EntryPoint address: ${entryPoint.address}`);
  console.log(`Smart account wallet: ${account.address}`);
  console.log(`Owner of wallet is: ${accountOwner.address}`);
  console.log(`Factory is: ${factory.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
