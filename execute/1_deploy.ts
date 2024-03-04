import {
  SimpleAccount,
  SimpleAccountFactory,
  SimpleAccountFactory__factory,
  EntryPoint,
  TokenPaymaster__factory,
  TokenPaymaster,
  EntryPoint__factory,
  IEntryPoint,
  SponsorPaymaster,
  SponsorPaymaster__factory
} from '../typechain-types';
import { ethers } from 'hardhat';
import { deployEntryPoint, createAccount } from './utils';
import { accountOwner } from '../config/accounts';
import { getEntryPoint, getPaymasterERC20, getPaymasterSponsor } from '../config/contracts';
import { getFactory } from '../config/contracts.example';

let entryPoint: EntryPoint;
let factory: SimpleAccountFactory;
let paymasterErc20: TokenPaymaster;
let paymasterSponsor: SponsorPaymaster;
let account: SimpleAccount;

async function main() {
  const ethersSigner = ethers.provider.getSigner();

  entryPoint = await new EntryPoint__factory(ethersSigner).deploy();

  factory = await new SimpleAccountFactory__factory(ethersSigner).deploy(entryPoint.address);

  // ({ proxy: account, accountFactory: factory } = await createAccount(
  //   ethersSigner,
  //   await accountOwner.getAddress(),
  //   entryPoint.address
  // ));

  paymasterErc20 = await new TokenPaymaster__factory(ethersSigner).deploy(
    factory.address,
    'SONY',
    entryPoint.address
  );

  paymasterSponsor = await new SponsorPaymaster__factory(ethersSigner).deploy(
    factory.address,
    entryPoint.address
  );

  console.log(`Paymaster ERC20 address is: ${paymasterErc20.address}`);
  console.log(`Paymaster Sponsor address is: ${paymasterSponsor.address}`);
  console.log(`EntryPoint address: ${entryPoint.address}`);
  // console.log(`Smart account wallet: ${account.address}`);
  // console.log(`Owner of wallet is: ${accountOwner.address}`);
  console.log(`Factory is: ${factory.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
