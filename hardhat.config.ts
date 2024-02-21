import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

const config: HardhatUserConfig = {
  defaultNetwork: 'mumbai',
  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
    sepolia: {
      url: 'https://rpc.sepolia.org',
      accounts: [process.env.PRIVATE_KEY as `0x${string}`],
    },
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
      accounts: [process.env.PRIVATE_KEY as `0x${string}`],
    },
    mumbai: {
      url: 'https://polygon-mumbai-bor.publicnode.com',
      accounts: [process.env.PRIVATE_KEY as `0x${string}`],
    }
  },
  solidity: {
    version: '0.8.23',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
      viaIR: true,
    },
  },
};

export default config;
