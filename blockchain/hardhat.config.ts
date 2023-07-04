import * as dotenv from 'dotenv'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config()

const OWNER_ACCOUNT_PK = process.env.OWNER_ACCOUNT_PK
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY

if (!OWNER_ACCOUNT_PK || !POLYGONSCAN_API_KEY) throw new Error('not enough env variable')

const config: HardhatUserConfig = {

  etherscan: {
    apiKey: {
      'polygonMumbai': POLYGONSCAN_API_KEY, //npx hardhat verify --network polygonMumbai <address>
    }
  },
  networks: {
    polygonMumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      chainId: 80001,
      accounts: [OWNER_ACCOUNT_PK]
    },
    hardhat: {
      loggingEnabled: true,
      accounts: [{
        privateKey: OWNER_ACCOUNT_PK,
        balance: '1000000000000000000',
      }],
      forking: {
        url: "https://polygon-mumbai.g.alchemy.com/v2/Ov1gzewx3K_wZmzoPhTND7_yfSHGrokb",
      }
    }
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  }
};

export default config;