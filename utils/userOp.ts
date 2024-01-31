import { BytesLike, BigNumberish, Bytes } from ".";
import { encodeAbiParameters, keccak256 } from 'viem'

export interface UserOperation {
    sender: string
    nonce: BigNumberish
    initCode: BytesLike
    callData: BytesLike
    callGasLimit: BigNumberish
    verificationGasLimit: BigNumberish
    preVerificationGas: BigNumberish
    maxFeePerGas: BigNumberish
    maxPriorityFeePerGas: BigNumberish
    paymaster: string
    paymasterVerificationGasLimit: BigNumberish
    paymasterPostOpGasLimit: BigNumberish
    paymasterData: BytesLike
    signature: BytesLike
}

export interface PackedUserOperation {
    sender: string
    nonce: BigNumberish
    initCode: BytesLike
    callData: BytesLike
    accountGasLimits: BytesLike
    preVerificationGas: BigNumberish
    maxFeePerGas: BigNumberish
    maxPriorityFeePerGas: BigNumberish
    paymasterAndData: BytesLike
    signature: BytesLike
}

export function getUserOpHash (userOp: UserOperation, entryPoint: string, chainId: number): string {
  try {
    let packedUserOp : PackedUserOperation = {
      sender: userOp.sender,
      nonce: userOp.nonce,
      callData: userOp.callData,
      accountGasLimits: "0x000000000000000000000000000249f000000000000000000000000000000000",
      initCode: userOp.initCode,
      preVerificationGas: userOp.preVerificationGas,
      maxFeePerGas: userOp.maxFeePerGas,
      maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
      paymasterAndData: "0x",
      signature: userOp.signature
    }

    const userOpHash = keccak256(encodeAbiParameters(
      ['address', 'uint256', 'bytes32', 'bytes32','bytes32', 'uint256', 'uint256', 'uint256','bytes32'],
      [packedUserOp.sender, packedUserOp.nonce, keccak256(packedUserOp.initCode as `0x${string}`), keccak256(packedUserOp.callData as `0x${string}`),
        packedUserOp.accountGasLimits, packedUserOp.preVerificationGas, packedUserOp.maxFeePerGas, packedUserOp.maxPriorityFeePerGas,
        keccak256(packedUserOp.paymasterAndData as `0x${string}`)] as never
    ))

    const enc = encodeAbiParameters(
      ['bytes32', 'address', 'uint256'],
      [userOpHash, entryPoint, chainId] as never)
    return keccak256(enc)
  } catch (err) {
    console.log({err})
  }
}

export function packUserOp(userOp: UserOperation) {
  return  {
    sender: userOp.sender,
    nonce: userOp.nonce,
    callData: userOp.callData,
    accountGasLimits: "0x000000000000000000000000000249f000000000000000000000000000000000",
    initCode: userOp.initCode,
    preVerificationGas: userOp.preVerificationGas,
    maxFeePerGas: userOp.maxFeePerGas,
    maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
    paymasterAndData: "0x",
    signature: userOp.signature
  }
}