import { Browser, BrowserContext } from "puppeteer";
import { IUser } from "../types/user.type";
import { closeBrowser, closeBrowserContext } from "./browser.helper";

export const throwBrowserException = (err: any, browser: Browser) => {
  const errMsg = (err as Error).message;
  closeBrowser(browser, errMsg);
  throw new Error(errMsg);
}

export const throwBrowserContextException = (err: any, context: BrowserContext, user: IUser) => {
  const errMsg = (err as Error).message;
  closeBrowserContext(context, user, errMsg);
  throw new Error(errMsg);
}