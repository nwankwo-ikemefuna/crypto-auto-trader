import { IUser } from "../types/user.type";
import { throwException } from "../utils/error.util";
import users from '../../public/users.json';

export const getActiveUsers = async () => {
  try {
    const validUsers = appendPasswords((users as unknown) as IUser[]);

    // get active users
    const activeUsers = validUsers.filter(({ isActive, password, subDays, lastSubAt }) =>
      isActive && password && isActiveSub(subDays, lastSubAt)) || [];

    return activeUsers;
  } catch(err) {
    return throwException(err);
  }
}

// TODO: deprecate when moved to database with backend api
const appendPasswords = (usersArr: IUser[]) => {
  try {
    const passwords = JSON.parse(process.env.USER_PASSWORDS || '');
    return usersArr.map(user => {
      user.password = passwords[user?.username] || '';
      return user;
    });
  } catch(err) {
    return throwException(err);
  }
}

const isActiveSub = (subDays: number, lastSubAt: string) => {
  const subDate = new Date(lastSubAt);
  const expireTime = subDate.setDate(subDate.getDate() + (subDays + 1));
  const now = new Date();
  return expireTime > now.getTime();
}
