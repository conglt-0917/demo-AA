import 'dotenv/config';
import { privateKeyToAccount } from 'viem/accounts';
const useTestNet = process.env.TEST_NET == 'true';
const privateKey = useTestNet ? process.env.PRIVATE_KEY : process.env.LOCALHOST_PRIVATE_KEY;

export const ownerAccount = privateKeyToAccount(privateKey as `0x${string}`);
