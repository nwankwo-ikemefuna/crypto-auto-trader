import { Page } from "puppeteer";

export const getLocalStorageData = async (page: Page, key: string) => {
  return await page.evaluate(() => localStorage.getItem(key));
}