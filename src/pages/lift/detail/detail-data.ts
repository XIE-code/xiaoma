// 内容区域
export interface IDetailItem {
  key: string // key
  label: string // 标题
  value: string // 文字
}

export const liftBaseInfoData = [
  {
    key: 'elevatorName',
    label: '电梯名称',
    value: '园洲花园8栋16号(测试)',
  },
  {
    key: 'elevatorNumber',
    label: '电梯编号',
    value: '230101114',
  },
  {
    key: 'elevatorType',
    label: '电梯类型',
    value: '',
  },
  {
    key: 'elevatorAddress',
    label: '所在小区',
    value: '一号楼',
  },
  {
    key: 'elevatorAddressDetail',
    label: '详细地址',
    value: '',
  },
]

/* 标签页信息 */
export type tabsItemType = {
  title: string
  data: tabsDataItemType[] // TODO: 更换类型
}
/* 标签内容 */
export type tabsDataItemType = {
  label: string
  value: string
}

export const leaveFactoryData = [
  {
    label: '电梯制作商',
    value: '0',
  },
  {
    label: '生产日期',
    value: '',
  },
  {
    label: '电梯品牌',
    value: '',
  },
  {
    label: '电梯品种',
    value: '电梯类型',
  },
  {
    label: '电梯型号',
    value: '',
  },
  {
    label: '改造单位',
    value: '',
  },
  {
    label: '改造型号',
    value: '',
  },
]

export const maintenanceData = [
  {
    label: '维保单位',
    value: '广东佳登曼电梯',
  },
  {
    label: '维保人员1-电话',
    value: '维保人员1-电话',
  },
  {
    label: '维保人员2-电话',
    value: '维保人员2-电话',
  },
  {
    label: '维保状态',
    value: '',
  },
  {
    label: '登记机关',
    value: '',
  },
  {
    label: '维保开始时间',
    value: '',
  },
  {
    label: '检验机构',
    value: '',
  },
  {
    label: '本次限速器效验时间',
    value: '',
  },
  {
    label: '本次制动试验时间',
    value: '',
  },
]
