import {
  breakdownCodeApi,
  liftGetRunApi,
  liftListApi,
  liftPushTroubleApi,
  liftLiftAddApi,
  knowledgeCategoryListApi,
  knowledgeDocumentListApi,
  maintenanceListApi,
} from '@/common/api'
import { http } from '@/utils/http'
/* 故障代码 */
export interface IBreakdownCodeParams {
  devices_id: string // 故障类型ID
}

/* 故障代码响应接口定义 */
export interface IBreakdownCodeResponse {
  devicesId: string // 故障型号ID
  fId: string // 故障代码ID
  eCode: string // 故障编码
  faultId: string // 故障类型ID
  syn: string // 备注信息
  solve: string // 解决办法
  fault: string // 故障描述
}

/* 故障代码 */
export const postBreakdownCode = (params: IBreakdownCodeParams) => {
  return http.post<IBreakdownCodeResponse[]>(breakdownCodeApi, params)
}

/* 电梯列表参数 */
export interface ILiftListParams {
  village_id?: string // 小区id；可为空
  lift_name?: string // 电梯名字；可为空
  limit: string // 单页展示数量
  page: string // 分页页码
  state?: string // 0:离线 1:在线 2:正常 3:故障
}

/* 电梯列表返回值 */
export interface ILiftListResponse {
  elevatorId?: number // 电梯ID
  registerCode?: string // 电梯注册码
  name?: string // 名称
  elevatorNumber?: number // 电梯编码
  address?: string // 地址
  isOnline?: string // 是否在线
  companyName?: string // 公司名称
  realname?: string // 姓名
  phone?: number // 电话
  serverIp?: string // 服务器IP
}

/* 电梯列表 */
export const postLiftList = (params: ILiftListParams) => {
  return http.post<ILiftListResponse[]>(liftListApi, params)
}

/* 电梯运行信息参数 */
export interface ILiftGetRunParams {
  code: string // 电梯编码
}

/* 电梯运行信息返回值 */
export interface ILiftGetRunResponse {
  elevatorId: number // 电梯编码
  rTimes: number // 运行次数
  rDuration: number // 运行时间
  rDistance: number // 运行距离
  oTimes: number // 开门次数
  eDuration: number // 故障时间
  serialNumber: number // 序列号
}

/* 电梯监控-运行与统计-累加数据 */
export const postLiftGetRun = (params: ILiftGetRunParams) => {
  return http.post<ILiftGetRunResponse>(liftGetRunApi, params)
}

/* 电梯预警记录请求参数接口 */
export interface ILiftPushTroubleParams {
  tid: string // 业务识别id，每次请求不重复
  troubleCode: string // 故障隐患编码
  troubleName: string // 故障隐患名称
  datas?: Array<{
    name: string // 运行名 = 运行时间[yyyyMMddHHmmss]+声音位置+楼层
    surl: string // 声音数据下载地址 = http://***
    aurl: string // 加速度数据下载地址 = http://***
  }> // 故障声音详情
}

/* 电梯预警记录返回值接口 */
export interface ILiftPushTroubleResponse {
  tid: string // 业务识别id，来自请求数据
}

/* 电梯预警记录 */
export const postLiftPushTrouble = (params: ILiftPushTroubleParams) => {
  return http.post<ILiftPushTroubleResponse>(liftPushTroubleApi, params)
}

/* 新增电梯信息请求参数接口 */
export interface ILiftLiftAddParams {
  name: string // 电梯名称
  register_code?: string // 出厂编码
  devices_id?: string // 设备代码
  floor?: string // 层
  station?: number // 站
  door?: number // 门
  load?: string // 载重
  speed?: string // 速度
}

/* 新增电梯信息返回参数接口 */
// export interface ILiftLiftAddResponse {}
export type ILiftLiftAddResponse = any

/* 新增电梯 */
export const postLiftLiftAdd = (params: ILiftLiftAddParams) => {
  return http.post<ILiftLiftAddResponse>(liftLiftAddApi, params)
}

/* 知识库类目表请求参数接口 */
export interface IKnowledgeCategoryListParams {
  parent_id: number // 目录父级ID，一级目录传0
}

/* 知识库类目表返回值接口 */
export interface IKnowledgeCategoryListResponse {
  id: number // 类目ID
  parentId: number // 父级ID
  name: string // 类目名称
  logoUrl: string // 类目logo URL
  createdTime: number // 创建时间
  updatedTime: number // 更新时间
}

/* 知识库类目表 */
export const postKnowledgeCategoryList = (params: IKnowledgeCategoryListParams) => {
  return http.post<IKnowledgeCategoryListResponse[]>(knowledgeCategoryListApi, params)
}

/* 知识库文件列表请求参数接口 */
export interface IKnowledgeDocumentListParams {
  category_id: number // 目录ID
  limit: number // 查询数量
  page: number // 当前页
}

/* 知识库文件列表返回值接口 */
export interface IKnowledgeDocumentListResponse {
  id: number // 文档ID
  categoryId: number // 目录ID
  title: string // 文档标题
  keyword: string // 关键词
  filePath: string // 文件路径
  createdTime: number // 创建时间
  updatedTime: number // 更新时间
}
/* 知识库文件列表 */
export const postKnowledgeDocumentList = (params: IKnowledgeDocumentListParams) => {
  return http.post<IKnowledgeDocumentListResponse[]>(knowledgeDocumentListApi, params)
}

/* 维修列表请求参数接口 */
export interface IMaintenanceListParams {
  time?: string // 维保日期，格式：2025-01-16
  limit: number // 查询数量
  page: number // 当前页
}

/* 维保状态 */
export type isMaintainType = 1 | 2 | 3 | 4

/* 维修对象 */
export interface IMaintenanceItem {
  id: number // 维保计划ID
  eleName: string // 电梯名称
  address: string // 地址
  elevatorNumber: string // 电梯编码
  registerCode: string // 电梯注册码
  isMaintain: isMaintainType // 维保状态 1：待维保， 2：已维保 ：3：进行中：4：逾期签到
  isMaintainTan: isMaintainType // 提交维保记录 1：待维保， 2：已维保 ：3：进行中：4：逾期签到
  maintType?: string // 维保类型
}

/* 维修列表返回值接口 */
export interface IMaintenanceListResponse {
  list: IMaintenanceItem[] // 维保计划列表
  count: number
}

/* 维修列表 */
export const postMaintenanceList = (params: IMaintenanceListParams) => {
  return http.post<IMaintenanceListResponse>(maintenanceListApi, params)
}
