/* 维修列表请求参数 */
export interface IMaintenanceListParams {
  time?: string // 维保日期，格式：2025-01-16
  limit: number // 查询数量
  page: number // 当前页
}

/* 维修状态类型 */
export type isMaintainType = 1 | 2 | 3 | 4

/* 维修列表返回类型 */
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

/* 维修列表返回类型 */
export interface IMaintenanceListResponse {
  list: IMaintenanceItem[] // 维保计划列表
  count: number
}

/* 维修详情请求参数 */
export interface IMaintenanceDetailParams {
  id: number // 维保计划ID
}

/* 电梯信息 */
export interface IElevatorInfo {
  elevatorNumber: number // 电梯编码
  name: string // 电梯名称
  villageName: string // 小区名称
  longitude: number // 经度
  latitude: number // 纬度
  address: string // 地址
  varietyType: string // 电梯类型
  companyId: number // 维保公司ID
}

/* 维保状态类型 */
export type IsMaintainType = 1 | 2 | 3 | 4
export type IsMaintainTanType = 0 | 1
export type IsQualifiedType = 1 | 2 | 0
export type IsCompleteType = 1 | 0
export type IsIdenType = 1 | 0
export type IsOrdersType = 1 | 0
export type IsAuthorityType = 1 | 0

/* 维保基础信息 */
export interface IMaintenanceBasis {
  id: number // 维保计划ID
  maintSn: string // 维保单号
  maintType: string // 维保类型
  signatureImgOne: string // 签名图片1 安全员
  signatureImgTwo: string // 签名图片2 维保员
  signatureImgThree: string // 签名图片3 物业
  isMaintain: IsMaintainType // 维保状态 1：待维保， 2：已维保 ：3：进行中：4：逾期签到
  isMaintainTan: IsMaintainTanType // 提交维保记录 0：未提交，1：已提交
  userName: string // 维保员名称
  qualified: IsQualifiedType // 是否合格 1不合格；2合格；0未审核
  all: number // 总数
  complete: IsCompleteType // 是否完成 1已完成 0未完成
  iden: IsIdenType // 是否签到 1已签到 0未签到
  maintTime: string // 维保时间
  remark: string | null // 备注信息
  maintEndTime: string // 维保完成时间
  isOrders: IsOrdersType // 是否接单 1已接单 0未接单
  isAuthority: IsAuthorityType // 是否有权限
}

/* 维保日志时间 */
export interface IMaintenanceLogTime {
  time: string // 记录时间
  type: string // 状态类型
}

/* 维修详情返回类型 */
export interface IMaintenanceDetail {
  ele: IElevatorInfo // 电梯信息
  basis: IMaintenanceBasis // 维保基础信息
  logTime: IMaintenanceLogTime[] // 维保日志时间
}
