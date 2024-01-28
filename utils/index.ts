import { createWalletClient, createPublicClient, http,  parseEther, formatEther } from "viem";
import { localhost } from 'viem/chains'
import { ownerAccount as account } from "../config/accounts";
import { UserOperation, PackedUserOperation } from "./userOp";

export type Bytes = ArrayLike<number>;
export type BytesLike = Bytes | `0x${string}`;
export type BigNumberish = bigint | string | number;

const walletClient = createWalletClient({
    account,
    chain: localhost,
    transport: http(),
})

export async function fund(to: `0x${string}`) {
    await walletClient.sendTransaction({
        account,
        to,
        value: parseEther('1'),
    })
}
