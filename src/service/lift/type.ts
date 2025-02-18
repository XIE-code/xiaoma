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
