require('dotenv').config();
import puppeteer, { BrowserLaunchArgumentOptions, LaunchOptions } from 'puppeteer';
import config from './config/config';

(async () => {
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

  // Create a new incognito browser context.
  const context = await browser.createIncognitoBrowserContext();
  // Create a new page in a pristine context.
  const page = await context.newPage();
  // Do stuff
  await page.goto('https://qschoolmanager.com');

  browser.targets().forEach(async target => {
    if (!target.browserContext().isIncognito()) {
      const targetPage =  await target.page();
      if (targetPage) {
        await targetPage.close();
      }
    }
  });
})();