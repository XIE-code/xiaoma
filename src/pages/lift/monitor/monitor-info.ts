export type btnType = {
  name: string
  type: maintenanceBtnType
}

export type maintenanceBtnType = 'info' | 'run' | 'maintenance' | 'breakdown'
export enum maintenanceBtnEnum {
  info = 'info',
  run = 'run',
  maintenance = 'maintenance',
  breakdown = 'breakdown',
}

export const monitorInfo = {
  name: '电梯名称',
  brand: '电梯品牌',
  model: '电梯型号',
  tid: '电梯梯种',
  address: '电梯地址',
  company: '使用单位',
  maintenanceCompany: '维保企业',
  userId1: '维保人员',
}

export const monitorRunInfo = {
  tid: '业务识别id',
  status: '电梯运行状态',
  direction: '运行方向',
  floor: '当前楼层',
  floorStart: '起始楼层',
  floorEnd: '结束楼层，运行结束时推送',
  distance: '运行距离【限本次运行】',
  maxSpeed: '最大运行速度【限本次运行】',
  gmt: '状态时间',
  doorTimes: '当天累计开关门次数【开门+关门记数1】',
  runningUpTimes: '当天累计向上运行次数',
  runningDownTimes: '当天累计向下运行次数',
}

export const runObj = {
  tid: '', // 业务识别id
  status: '', // 电梯运行状态 stop/running
  direction: '', // 运行方向 up/down
  floor: null, // 当前楼层
  floorStart: null, // 起始楼层
  floorEnd: null, // 结束楼层
  distance: null, // 运行距离
  maxSpeed: null, // 最大运行速度
  gmt: null, // 状态时间
  doorTimes: null, // 当天累计开关门次数
  runningUpTimes: null, // 当天累计向上运行次数
  runningDownTimes: null, // 当天累计向下运行次数
}

export const showInfoData = [
  {
    icon: 'dashboard',
    num: '0m/s',
    text: '运行速度',
  },
  {
    icon: 'swap-right',
    num: '--m',
    text: '运行距离',
  },
  {
    icon: 'time',
    num: '0',
    text: '运行时间',
  },
]

export const btnListData = [
  {
    name: '电梯信息',
    type: maintenanceBtnEnum.info,
  },
  {
    name: '运行统计',
    type: maintenanceBtnEnum.run,
  },
  {
    name: '维保记录',
    type: maintenanceBtnEnum.maintenance,
  },
  {
    name: '故障记录',
    type: maintenanceBtnEnum.breakdown,
  },
]
