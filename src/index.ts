require('dotenv').config();
import moment from 'moment';
import cron from 'node-cron';
import puppeteer, { BrowserLaunchArgumentOptions, LaunchOptions } from 'puppeteer';
import config from './config/config';
import { login } from './services/auth.service';
import { runTransaction } from './services/transaction.service';
import { getActiveUsers } from './services/user.service';
import { throwException } from './utils/error.util';

const init = async () => {
  try {

    // get active users
    const activeUsers = await getActiveUsers();
    if (!activeUsers.length) {
      throw new Error('No active user accounts found!');
    }

    const browserOptions: BrowserLaunchArgumentOptions & LaunchOptions = { 
      headless: config.browser.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
    if (!config.browser.headless && config.browser.executablePath) {
      browserOptions.executablePath = config.browser.executablePath;
    }
    const browser = await puppeteer.launch(browserOptions);

    await Promise.all(activeUsers.map(async user => {
      const incognitoWindowContext = await browser.createIncognitoBrowserContext();
      const page = await incognitoWindowContext.newPage();
      page.setUserAgent(await browser.userAgent());

      await login(page, user);
      await runTransaction(page, user);
    }));

    //await browser.close();

  } catch(err) {
    throwException(err);
  }
};

const nextJobTime = moment().add(config.cron.interval, 'minutes').format('hh:mm A');
console.log(`Job scheduled to start by ${nextJobTime}!`);

cron.schedule("*/5 * * * *", async () => {
  await init();
});