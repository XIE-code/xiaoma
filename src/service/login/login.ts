import { http } from '@/utils/http'
import { loginApi } from '@/common/api'
import { ILoginParams, ILoginResponse } from './type'

/* 登录 */
export const postLogin = (params: ILoginParams) => {
  return http.post<ILoginResponse>(loginApi, params)
}
