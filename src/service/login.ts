import { http } from '@/utils/http'
import { loginApi } from '@/common/api'

/* 登录接口参数 */
export interface ILoginParams {
  name: string
  password: string
}

/* 登录接口返回类型 */
export interface ILoginResponse {
  user_id: number // 用户ID
  token: string // 访问令牌
  company_id: number // 公司ID
  user_name: string // 用户名
  email: string // 邮箱
  realname: string // 姓名
  phone: string // 电话
  office_phone: string // 工作电话
  sex: number // 性别
  identity: string // 身份
  head_img: string // 头像
  jobs: number // 职位
  role_id: number // 角色ID
  role: number // 角色
  company_type: number // 公司类型
  company_name: string // 公司名称
}

/* 登录 */
export const postLogin = (params: ILoginParams) => {
  return http.post<ILoginResponse>(loginApi, params)
}
