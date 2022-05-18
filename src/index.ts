require('dotenv').config();
import moment from 'moment';
import cron from 'node-cron';

import puppeteer from 'puppeteer';
import config from './config/config';
import { login } from './services/auth.service';
import { runTransaction } from './services/transaction.service';

const init = async () => {
  try {
    const activeUsers = config.users.filter(({ isActive }) => isActive === 1) || [];
    if (!activeUsers.length) {
      throw new Error('No user accounts found!');
    }

    const browser = await puppeteer.launch({
      headless: config.browser.headless,
      executablePath: config.browser.executablePath,
    });

    await Promise.all(activeUsers.map(async user => {
      const incognitoWindowContext = await browser.createIncognitoBrowserContext();
      const page = await incognitoWindowContext.newPage();
      page.setUserAgent(await browser.userAgent());

      await login(page, user);
      await runTransaction(page, user);
      // incognitoWindowContext.close();
    }));

    //await browser.close();

  } catch(err) {
    const error = err as Error;
    console.log(error.message);
  }
};

const nextJobTime = moment().add(config.cron.interval, 'minutes').format('hh:mm A');
console.log(`Job scheduled to start by ${nextJobTime}!`);

cron.schedule("*/5 * * * *", async () => {
  await init();
});