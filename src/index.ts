require('dotenv').config();
import moment from 'moment';
import cron from 'node-cron';
import puppeteer, { BrowserLaunchArgumentOptions, LaunchOptions } from 'puppeteer';
import config from './config/config';
import { login } from './services/auth.service';
import { runTransaction } from './services/transaction.service';
import { getActiveUsers } from './services/user.service';

const init = async () => {
  try {
    const browserOptions: BrowserLaunchArgumentOptions & LaunchOptions = { 
      headless: config.browser.headless,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
      ],
    };
    if (!config.browser.headless && config.browser.executablePath) {
      browserOptions.executablePath = config.browser.executablePath;
    }
    const browser = await puppeteer.launch(browserOptions);

    // close any previously open pages, including the default browser context page (as it isn't needed)
    const pages = await browser.pages() || [];
    if (pages.length > 0) {
      pages.forEach(async page => {
        await page.close();
      });
      console.log(`NOTICE: ${pages.length} previous page${pages.length === 1 ? '' : 's'} closed successfully!`);
    }

    // get active users
    const activeUsers = await getActiveUsers(browser);
    if (!activeUsers.length) {
      throw new Error('No active user accounts found!');
    }

    await Promise.all(activeUsers.map(async user => {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      page.setUserAgent(await browser.userAgent());

      // login and run transaction
      await login(context, page, user);
      await runTransaction(context, page, user);
    }));

  } catch(err) {
    throw new Error((err as Error).message);
  } 
};

const nextJobTime = moment().add(config.cron.interval, 'minutes').format('hh:mm A');
console.log(`Job scheduled to start by ${nextJobTime}!`);

cron.schedule(`*/${config.cron.interval} * * * *`, async () => {
  await init();
});