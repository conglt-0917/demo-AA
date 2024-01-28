
import { createWalletClient, http } from "viem";
import { localhost } from 'viem/chains'
import { abi } from "../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json";
import { bytecode as bytecodeEntryPoint } from '../artifacts/contracts/core/EntryPoint.sol/EntryPoint.json'
import { privateKeyToAccount } from 'viem/accounts'
import { ownerAccount as account } from "../config/accounts";

const walletClient = createWalletClient({
  account,
  chain: localhost,
  transport: http(),
})


async function main() {
  const hash = await walletClient.deployContract({
    abi,
    account,
    bytecode: bytecodeEntryPoint as `0x${string}`,
  })

  console.log(`TX hash: ${hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});