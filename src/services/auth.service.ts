import { BrowserContext, Page } from "puppeteer";
import config from "../config/config";
import { pageSelectors } from "../constants/selectors.constant";
import { IUser } from "../types/user.type";
import { throwBrowserContextException } from "../helpers/error.helper";
import { closeBrowserContext } from "../helpers/browser.helper";

const selectors = pageSelectors.auth;

export const login = async (context: BrowserContext, page: Page, user: IUser) => {
  try {

    const elemEventOptions = { delay: config.platform.selector.delay };

    console.log(`${user.displayName}: Navigating to login page...`);
    await page.goto(config.platform.loginPage, { ...config.platform.navigation });

    // click on country code field
    console.log(`${user.displayName}: Entering country code...`);
    await page.waitForSelector(selectors.ccLabel);
    await page.click(selectors.ccLabel, elemEventOptions);

    // type in country code
    await page.waitForSelector(selectors.ccInput);
    await page.type(selectors.ccInput, user.countryCode, elemEventOptions);

    // click confirm button
    await page.waitForSelector(selectors.ccConfirmBtn);
    await page.click(selectors.ccConfirmBtn, elemEventOptions);

    // type in username and password
    console.log(`${user.displayName}: Entering username and password...`);
    await page.waitForSelector(selectors.usernameInput);
    await page.waitForSelector(selectors.passwordInput);
    await page.type(selectors.usernameInput, user.username, elemEventOptions);
    await page.type(selectors.passwordInput, user.password!, elemEventOptions);

    // click login button
    console.log(`${user.displayName}: Logging in...`);
    await Promise.all([
      page.waitForSelector(selectors.loginBtn),
      page.click(selectors.loginBtn, elemEventOptions),
      // wait for navigation to dashboard
      page.waitForNavigation({ timeout: config.platform.navigation.timeout })
    ]);

    // verify login
    console.log(`${user.displayName}: Verifying login...`);
    const loggedIn = await isLoggedIn(context, page, user);
    if (loggedIn) {
      console.log(`${user.displayName}: Login succeeded!`);
      return true;
    }
    return false;
  } catch(err) {
    return throwBrowserContextException(err, context, user);
  }
};

export const isLoggedIn = async (context: BrowserContext, page: Page, user: IUser) => {
  try {
    const [isLoggedin, accessToken] = await Promise.all([
      page.evaluate(() => localStorage.getItem('IS_LOGIN')),
      page.evaluate(() => localStorage.getItem('accessToken')),
    ]);

    if (!accessToken || isLoggedin !== 'Y') {
      console.log(`${user.displayName}: Unable to login! Please check credentials.`);
      closeBrowserContext(context, user, 'Unable to login!');
      return false;
    }
    return true;
  } catch(err) {
    return throwBrowserContextException(err, context, user);
  }
};