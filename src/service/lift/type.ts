/* 故障代码请求参数 */
export interface IBreakdownCodeParams {
  devices_id: string // 故障类型ID
}

/* 故障代码返回类型 */
export interface IBreakdownCodeResponse {
  devicesId: string // 故障型号ID
  fId: string // 故障代码ID
  eCode: string // 故障编码
  faultId: string // 故障类型ID
  syn: string // 备注信息
  solve: string // 解决办法
  fault: string // 故障描述
}

/* 电梯列表请求参数 */
export interface ILiftListParams {
  village_id?: string // 小区id；可为空
  lift_name?: string // 电梯名字；可为空
  limit: string // 单页展示数量
  page: string // 分页页码
  state?: string // 0:离线 1:在线 2:正常 3:故障
}

/* 电梯列表返回类型 */
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

/* 电梯运行信息请求参数 */
export interface ILiftGetRunParams {
  code: string // 电梯编码
}

/* 电梯运行信息返回类型 */
export interface ILiftGetRunResponse {
  elevatorId: number // 电梯编码
  rTimes: number // 运行次数
  rDuration: number // 运行时间
  rDistance: number // 运行距离
  oTimes: number // 开门次数
  eDuration: number // 故障时间
  serialNumber: number // 序列号
}

/* 电梯预警记录请求参数 */
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

/* 电梯预警记录返回类型 */
export interface ILiftPushTroubleResponse {
  tid: string // 业务识别id，来自请求数据
}

/* 新增电梯信息请求参数 */
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

/* 新增电梯信息返回类型 */
export type ILiftLiftAddResponse = any

/* 知识库类目表请求参数 */
export interface IKnowledgeCategoryListParams {
  parent_id: number // 目录父级ID，一级目录传0
}

/* 知识库类目表返回类型 */
export interface IKnowledgeCategoryListResponse {
  id: number // 类目ID
  parentId: number // 父级ID
  name: string // 类目名称
  logoUrl: string // 类目logo URL
  createdTime: number // 创建时间
  updatedTime: number // 更新时间
}

/* 知识库文件列表请求参数 */
export interface IKnowledgeDocumentListParams {
  category_id: number // 目录ID
  limit: number // 查询数量
  page: number // 当前页
}

/* 知识库文件列表返回类型 */
export interface IKnowledgeDocumentListResponse {
  id: number // 文档ID
  categoryId: number // 目录ID
  title: string // 文档标题
  keyword: string // 关键词
  filePath: string // 文件路径
  createdTime: number // 创建时间
  updatedTime: number // 更新时间
}

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
