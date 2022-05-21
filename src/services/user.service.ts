import { IUser } from "../types/user.type";
import { throwBrowserException } from "../helpers/error.helper";
import users from '../../public/users.json';
import { Browser } from "puppeteer";

export const getActiveUsers = async (browser: Browser) => {
  try {
    const validUsers = appendPasswords(browser, (users as unknown) as IUser[]);

    // get active users
    const activeUsers = validUsers.filter(({ isActive, password, subDays, lastSubAt }) =>
      isActive && password && isActiveSub(subDays, lastSubAt)) || [];

    return activeUsers;
  } catch(err) {
    return throwBrowserException(err, browser);
  }
}

// TODO: deprecate when moved to database with backend api
const appendPasswords = (browser: Browser, usersArr: IUser[]) => {
  try {
    const passwords = JSON.parse(process.env.USER_PASSWORDS || '');
    return usersArr.map(user => {
      user.password = passwords[user?.username] || '';
      return user;
    });
  } catch(err) {
    return throwBrowserException(err, browser);
  }
}

const isActiveSub = (subDays: number, lastSubAt: string) => {
  const subDate = new Date(lastSubAt);
  // add 1 day to sub date
  const expireTime = subDate.setDate(subDate.getDate() + (subDays + 1));
  const now = new Date();
  return expireTime > now.getTime();
}
