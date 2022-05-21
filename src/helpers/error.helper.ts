import { Browser, BrowserContext, Page } from "puppeteer";
import { IUser } from "../types/user.type";
import { closeBrowser, closeBrowserContext } from "./browser.helper";

export const throwBrowserException = (err: any, browser: Browser) => {
  const errMsg = (err as Error).message;
  closeBrowser(browser, errMsg);
  throw new Error(errMsg);
}

export const throwBrowserContextException = (err: any, context: BrowserContext, page: Page, user: IUser) => {
  const errMsg = (err as Error).message;
  closeBrowserContext(context, page, user, errMsg);
  throw new Error(errMsg);
}