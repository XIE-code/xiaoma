import {
  breakdownCodeApi,
  liftGetRunApi,
  liftListApi,
  liftPushTroubleApi,
  liftAddApi,
  liftOneInfoApi,
} from '@/common/api'
import { http } from '@/utils/http'
import {
  IBreakdownCodeParams,
  IBreakdownCodeResponse,
  ILiftListParams,
  ILiftListResponse,
  ILiftGetRunParams,
  ILiftGetRunResponse,
  ILiftPushTroubleParams,
  ILiftPushTroubleResponse,
  ILiftAddParams,
  ILiftAddResponse,
  ILiftOneInfoParams,
  ILiftOneInfoResponse,
} from './type'

/* 故障代码 */
export const postBreakdownCode = (params: IBreakdownCodeParams) => {
  return http.post<IBreakdownCodeResponse[]>(breakdownCodeApi, params)
}

/* 电梯列表 */
export const postLiftList = (params: ILiftListParams) => {
  return http.post<ILiftListResponse[]>(liftListApi, params)
}

/* 电梯运行信息 */
export const postLiftGetRun = (params: ILiftGetRunParams) => {
  return http.post<ILiftGetRunResponse>(liftGetRunApi, params)
}

/* 电梯预警记录 */
export const postLiftPushTrouble = (params: ILiftPushTroubleParams) => {
  return http.post<ILiftPushTroubleResponse>(liftPushTroubleApi, params)
}

/* 新增电梯信息 */
export const postLiftLiftAdd = (params: ILiftAddParams) => {
  return http.post<ILiftAddResponse>(liftAddApi, params)
}

/* 单个电梯详细信息 */
export const postLiftOneInfo = (params: ILiftOneInfoParams) => {
  return http.post<ILiftOneInfoResponse>(liftOneInfoApi, params)
}
