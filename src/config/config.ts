import { TwaitUntil } from "../types/browser.type";
import { IUser } from "../types/user.type";

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV! || 'development',
  appName: 'Crypto Auto-Trader',
  browser: {
    headless: process.env.BROWSER_HEADLESS === 'true' || false,
    executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  },
  platform: {
    name: 'COTP',
    domain: 'https://cotps.com',
    transactionPage: 'https://cotps.com/#/pages/transaction/transaction',
    loginPage: 'https://cotps.com/#/pages/login/login?originSource=userCenter',
    navigation: {
      timeout: 30 * 1000, // 30 seconds
      waitUntil: 'domcontentloaded' as TwaitUntil,
    },
    selector: {
      delay: 150, // 150 milliseconds
      staticTimeout: 1 * 1000, // 1 second
      dynamicTimeout: 15 * 1000, // 15 seconds
    }
  },
  cron: {
    interval: 5, // 5 minutes
  },
  users: (JSON.parse(process.env.USER_ACCOUNTS!) as unknown) as IUser[],
};

export default config;