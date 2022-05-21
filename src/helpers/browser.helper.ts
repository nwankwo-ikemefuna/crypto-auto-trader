import { Browser, BrowserContext, Page } from "puppeteer";
import { IUser } from "../types/user.type";

export const closeBrowser = (browser: Browser, reason: string, afterInSecs = 3) => {
  console.log(`>>>END: ${reason}... Closing browser in ${afterInSecs} seconds...`);
  setTimeout(async () => {
    await browser.close();
  }, afterInSecs * 1000);
}

export const closeBrowserContext = (context: BrowserContext, page: Page, user: IUser, reason: string, afterInSecs = 3) => {
  console.log(`>>>END: ${user.displayName}: ${reason}... Closing page and browser context in ${afterInSecs} seconds...`);
  setTimeout(async () => {
    await page.close();
    await context.close();
  }, afterInSecs * 1000);
}

export const getLocalStorageData = async (page: Page, key: string) => {
  return await page.evaluate(() => localStorage.getItem(key));
}