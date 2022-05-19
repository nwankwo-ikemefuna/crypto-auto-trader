import { IAnyObject } from "./common.type";

export type THttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface IAxiosReqConfig {
  method?: THttpMethod;
  url?: string;
  endpoint?: string;
  data?: IAnyObject | null;
  headers?: IAnyObject | null;
  multipart?: boolean;
}