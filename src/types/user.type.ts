export interface IUser {
  countryCode: string;
  username: string;
  password?: string;
  displayName: string;
  isActive: boolean;
  subDays: number;
  lastSubAt: string;
}