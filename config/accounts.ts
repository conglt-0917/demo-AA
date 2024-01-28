import 'dotenv/config';
import { privateKeyToAccount } from 'viem/accounts'

export const ownerAccount = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);