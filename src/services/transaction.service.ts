import moment from "moment";
import { Page } from "puppeteer";
import config from "../config/config";
import { pageSelectors } from "../constants/selectors.constant";
import { IUser } from "../types/user.type";
import { isLoggedIn } from "./auth.service";

const elemEventOptions = { delay: config.platform.selector.delay };
const staticElemOptions = { timeout: config.platform.selector.dynamicTimeout } 
const dynamicElemOptions = { visible: true, timeout: config.platform.selector.dynamicTimeout };

const orderInterval = 20 * 1000; // 20 seconds
const cronJobInterval = 5; // 5 minutes
const minTotalAssets = 5;
const minWalletBal = 5;
const nextTranxTime = moment().add(cronJobInterval, 'minutes').format('hh:mm A');

const selectors = pageSelectors.tranx;

let orderTimer: NodeJS.Timeout;

export const runTransaction = async (page: Page, user: IUser) => {
  // navigate to transaction hall page
  console.log(`${user.displayName}: Navigating to transaction hall page...`);
  await page.goto(config.platform.transactionPage, { ...config.platform.navigation });

  // start transaction cycle
  console.log(`NOTICE: ${user.displayName}: Starting new transaction cycle in ${orderInterval / 1000} seconds...`);
  orderTimer = setInterval(async () => await runOrderCycle(page, user), orderInterval);
};

const endOrderCycle = (user: IUser) => {
  clearInterval(orderTimer);
  console.log(`NOTICE: ${user.displayName}: Order cycle ended/aborted...`);
};

export const runOrderCycle = async (page: Page, user: IUser) => {
  try {
    if (!await canRunTransaction(page, user)) return;

    console.log(`NOTICE: ${user.displayName}: Initiating order cycle...`);

    // click order button
    console.log(`${user.displayName}: Clicking order button...`);
    await page.click(selectors.orderBtn, elemEventOptions);

    // wait for sell modal to appear and then click on sell button
    console.log(`${user.displayName}: Clicking sell button...`);
    await page.waitForSelector(selectors.tranxModal, dynamicElemOptions);
    await page.click(selectors.sellBtn, elemEventOptions);

    // wait for confirm modal with transaction success to appear and then click on confirm button
    console.log(`${user.displayName}: Clicking confirm button...`);
    await page.waitForSelector(selectors.tranxModal, dynamicElemOptions);
    await page.waitForSelector(selectors.tranxSuccessText, dynamicElemOptions);
    await page.click(selectors.confirmBtn, elemEventOptions);
  
    console.log(`NOTICE: ${user.displayName}: Order cycle completed successfully!`);
    
  } catch(err) {
    const error = err as Error;
    console.log(`ERR: ${user.displayName}: `, error.message);
  }
};

const canRunTransaction = async (page: Page, user: IUser) => {
  try {
    // check if user is logged in
    const loggedIn = await isLoggedIn(page, user);
    if (!loggedIn) {
      console.log(`NOTICE: ${user.displayName}: Not loggedin!`);
      endOrderCycle(user);
      return false;
    }

    const inPositionPromise = await Promise.all([
      page.waitForSelector(selectors.totalAssetsText, staticElemOptions),
      page.waitForSelector(selectors.tranxBalText, staticElemOptions),
      page.waitForSelector(selectors.walletBalText, staticElemOptions),
      page.waitForSelector(selectors.orderBtn, staticElemOptions),
    ]);
    if (!inPositionPromise) {
      endOrderCycle(user);
      return false;
    }

    // check sufficient total assets
    const totalAssets = parseInt(await page.$eval(selectors.totalAssetsText, el => el.textContent) || '');
    if (totalAssets < minTotalAssets) {
      console.log(`NOTICE: ${user.displayName}: Insufficient total assets! Awaiting next transaction cycle at ${nextTranxTime}!`);
      clearInterval(orderTimer);
      endOrderCycle(user);
      return false;
    }

    // check if transactions have fully returned if initial order cycle
    const tranxBal = parseInt(await page.$eval(selectors.tranxBalText, el => el.textContent) || '');
    const orderCycleInProgress = (totalAssets - tranxBal) > minWalletBal;
    if (!orderCycleInProgress && tranxBal > 0) {
      console.log(`NOTICE: ${user.displayName}: Transactions have not fully returned to wallet! Awaiting next transaction cycle at ${nextTranxTime}!`);
      endOrderCycle(user);
      return false;
    }

    // check sufficient wallet balance
    const walletBal = parseInt(await page.$eval(selectors.walletBalText, el => el.textContent) || '');
    if (walletBal < minWalletBal) {
      console.log(`NOTICE: ${user.displayName}: Insufficient wallet balance! Awaiting next transaction cycle at ${nextTranxTime}!`);
      endOrderCycle(user);
      return false;
    }

    return true;
  } catch(err) {
    const error = err as Error;
    console.log(`ERR: ${user.displayName}: `, error.message);
    endOrderCycle(user);
    return false;
  }
};