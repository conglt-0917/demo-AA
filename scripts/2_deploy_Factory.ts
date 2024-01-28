import { createWalletClient, http } from "viem";
import { localhost } from 'viem/chains'
import { abi } from "../artifacts/contracts/samples/SimpleAccountFactory.sol/SimpleAccountFactory.json";
import { bytecode as bytecodeFactory } from '../artifacts/contracts/samples/SimpleAccountFactory.sol/SimpleAccountFactory.json'
import { ownerAccount as account } from "../config/accounts";
import { contractAddress } from "../config/contracts";

const walletClient = createWalletClient({
  account,
  chain: localhost,
  transport: http(),
})


async function main() {
  const hash = await walletClient.deployContract({
    abi,
    account,
    args: [contractAddress.entryPoint],
    bytecode: bytecodeFactory as `0x${string}`,
  })

  console.log(`TX hash: ${hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});