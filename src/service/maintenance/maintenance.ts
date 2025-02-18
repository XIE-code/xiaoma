import {
  maintenanceListApi,
  maintenanceDetailApi,
  maintenanceSignInApi,
  maintenanceSignatureApi,
} from '@/common/api'
import { http } from '@/utils/http'
import {
  IMaintenanceListParams,
  IMaintenanceListResponse,
  IMaintenanceDetailParams,
  IMaintenanceDetailResponse,
  IMaintenanceSignInParams,
  IMaintenanceSignInResponse,
  IMaintenanceSignatureParams,
  IMaintenanceSignatureResponse,
} from './type'

/* 维修列表 */
export const postMaintenanceList = (params: IMaintenanceListParams) => {
  return http.post<IMaintenanceListResponse>(maintenanceListApi, params)
}

/* 维修详情 */
export const postMaintenanceDetail = (params: IMaintenanceDetailParams) => {
  return http.post<IMaintenanceDetailResponse>(maintenanceDetailApi, params)
}

/* 维保签到 */
export const postMaintenanceSignIn = (params: IMaintenanceSignInParams) => {
  return http.post<IMaintenanceSignInResponse>(maintenanceSignInApi, params)
}

/* 维保订单签字 */
export const postMaintenanceSignature = (params: IMaintenanceSignatureParams) => {
  return http.post<IMaintenanceSignatureResponse>(maintenanceSignatureApi, params)
}
