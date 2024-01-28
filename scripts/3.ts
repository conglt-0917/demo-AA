import { createWalletClient, createPublicClient, http, getContract, getAddress, parseEther } from "viem";
import { localhost } from 'viem/chains'
import { abi as abiFactory } from "../artifacts/contracts/samples/SimpleAccountFactory.sol/SimpleAccountFactory.json";
import { abi as abiSimpleAccount } from "../artifacts/contracts/samples/SimpleAccount.sol/SimpleAccount.json";
import { contractAddress } from "../config/contracts";
import { ownerAccount as account } from "../config/accounts";
import { fund } from "../utils";
import { UserOperation, PackedUserOperation, getUserOpHash, packUserOp } from "../utils/userOp";
import { toBytes } from 'viem'

const publicClient = createPublicClient({
    chain: localhost,
    transport: http()
})

const walletClient = createWalletClient({
    account,
    chain: localhost,
    transport: http(),
})

const factory = getContract({
    address: contractAddress.accountFactory,
    abi: abiFactory,
    publicClient,
    walletClient,
})

async function main() {
    const chainId = await publicClient.getChainId() 

    await factory.write.createAccount([account.address, 0]);
    const walletAddress = await factory.read.getAddress([account.address, 0]) as `0x${string}`;

    const simpleAccount = getContract({
        address: walletAddress,
        abi: abiSimpleAccount,
        publicClient,
        walletClient,
    })

    await fund(walletAddress);

    let sampleOp : UserOperation = {
        sender: walletAddress,
        nonce: 0,
        initCode: '0x',
        callData: '0x',
        callGasLimit: 0,
        verificationGasLimit: 150000,
        preVerificationGas: 21000,
        maxFeePerGas: 1475469449,
        maxPriorityFeePerGas: 1000000000,
        paymaster: '0x0000000000000000000000000000000000000000',
        paymasterData: '0x',
        paymasterVerificationGasLimit: 300000,
        paymasterPostOpGasLimit: 0,
        signature: '0x'
    }

    const message = getUserOpHash(sampleOp, contractAddress.entryPoint, chainId);
    const signature = await walletClient.signMessage({ message });

    sampleOp.signature = signature;

    const packedOp = packUserOp(sampleOp)
    console.log(packUserOp);
    // await simpleAccount.write.addDeposit([], { value: parseEther('1') })
    // console.log(await simpleAccount.read.getDeposit());
   
}
  
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});