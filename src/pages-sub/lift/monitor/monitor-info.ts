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

export const runInfoText = {
  status: '电梯运行状态',
  direction: '运行方向',
  floor: '当前楼层',
  distance: '运行距离',
  maxSpeed: '最大运行速度',
  gmt: '状态时间',
  doorTimes: '当天累计开关门次数',
  runningUpTimes: '当天累计向上运行次数',
  runningDownTimes: '当天累计向下运行次数',
}

export const runInfoData = {
  status: null, // 电梯运行状态 stop/running
  direction: null, // 运行方向 up/down
  floor: null, // 当前楼层
  distance: null, // 运行距离
  maxSpeed: null, // 最大运行速度
  gmt: null, // 状态时间
  doorTimes: null, // 当天累计开关门次数
  runningUpTimes: null, // 当天累计向上运行次数
  runningDownTimes: null, // 当天累计向下运行次数
}

export const showInfo = [
  {
    icon: 'dashboard',
    type: 'maxSpeed',
    text: '运行速度',
  },
  {
    icon: 'swap-right',
    type: 'distance',
    text: '运行距离',
  },
  {
    icon: 'time',
    type: 'time',
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
