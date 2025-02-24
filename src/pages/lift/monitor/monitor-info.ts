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
