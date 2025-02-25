/* svg */
import myNewsSVG from '@/static/svg/my-news.svg'
import aboutUsSvg from '@/static/svg/about-us.svg'
import archiveSVG from '@/static/svg/archive.svg'
import changePwdSVG from '@/static/svg/change-password.svg'
/* page */
import { liftListPage } from '@/common/pages'

export interface IRouterItem {
  icon: string // 图标
  label: string // 标题
  value: string // 文字
  path: string // 路由
}

/* 路由跳转信息 */
export const routerListInfo = [
  {
    icon: myNewsSVG,
    label: '我的消息',
    value: '园洲花园8栋16号',
    path: '',
  },
  {
    icon: aboutUsSvg,
    label: '关于我们',
    value: '230101114',
    path: '',
  },
  {
    icon: archiveSVG,
    label: '档案资料',
    value: '',
    path: liftListPage,
  },
  {
    icon: changePwdSVG,
    label: '修改密码',
    value: '一号楼',
    path: '',
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
