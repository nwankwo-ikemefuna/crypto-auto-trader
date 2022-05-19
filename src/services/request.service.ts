import axios, { AxiosResponse } from "axios";
import { IAxiosReqConfig } from "../types/request.type";
import { throwException } from "../utils/error.util";

export const makeRequest = async<R>(requestConfig: IAxiosReqConfig): Promise<AxiosResponse<R>> => {
  try {
    const res: AxiosResponse<R> = await axios({
      method: requestConfig?.method ?? 'get',
      url: requestConfig.url,
      data: requestConfig?.data ?? {},
      headers: requestConfig?.headers ?? { 'Content-Type': 'application/json' },
    });
    console.log('res', res);
    return res;
  } catch (err) {
    return throwException(err);
  }
};