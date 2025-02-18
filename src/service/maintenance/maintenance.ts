import { maintenanceListApi, maintenanceDetailApi } from '@/common/api'
import { http } from '@/utils/http'
import {
  IMaintenanceListParams,
  IMaintenanceListResponse,
  IMaintenanceDetailParams,
  IMaintenanceDetail,
} from './type'

/* 维修列表 */
export const postMaintenanceList = (params: IMaintenanceListParams) => {
  return http.post<IMaintenanceListResponse>(maintenanceListApi, params)
}

/* 维修详情 */
export const postMaintenanceDetail = (params: IMaintenanceDetailParams) => {
  return http.post<IMaintenanceDetail>(maintenanceDetailApi, params)
}
