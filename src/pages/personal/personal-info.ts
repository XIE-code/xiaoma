/* svg */
import { svgStatic } from '@/common/static'

/* page */
import { liftListPage, changePasswordPage } from '@/common/pages'

export interface IRouterItem {
  icon: string // 图标
  label: string // 标题
  value: string // 文字
  path: string // 路由
}

/* 路由跳转信息 */
export const routerListInfo = [
  {
    icon: svgStatic.myNews,
    label: '我的消息',
    value: '园洲花园8栋16号',
    path: '',
  },
  {
    icon: svgStatic.aboutUs,
    label: '关于我们',
    value: '230101114',
    path: '',
  },
  {
    icon: svgStatic.archive,
    label: '档案资料',
    value: '',
    path: liftListPage,
  },
  {
    icon: svgStatic.changePassword,
    label: '修改密码',
    value: '',
    path: changePasswordPage,
  },
]

/* 暂时隐藏的电梯数据 */
export const elevatorListInfo = [
  {
    name: '今日维保电梯数',
    value: '0',
  },
  {
    name: '未完成维保电梯数',
    value: '0',
  },
  {
    name: '预警电梯数',
    value: '0',
  },
]
