/* 第三方库 */
import { useToast } from 'wot-design-uni'
/* constant */
import { SERVER_BASEURL } from '@/common/constant'
/* img */
import homeLogo from '@/static/image/home-logo.png'

/* 提示信息 */
export const showToast = (message: string) => {
  const toast = useToast()
  toast.show({
    msg: message,
  })
}

/**
 * @function px2rpx
 * 1. 设计稿转换px为rpx
 */
export const px2rpx = (px: number) => {
  return (px / 390) * 750 + 'rpx'
}

export interface IWeekDate {
  year: number
  month: string
  day: string
  week: string
}

/**
 * @function getWeekDates 获取本周所有日期
 * 1. 获取当前日期，调整到周一
 * 2. 返回本周的周日历
 */
/* TODO: dayjs优化 */
export const getWeekDates = () => {
  // 定义一周的映射关系
  const weekObj = [
    { idx: 0, week: '周日' },
    { idx: 1, week: '周一' },
    { idx: 2, week: '周二' },
    { idx: 3, week: '周三' },
    { idx: 4, week: '周四' },
    { idx: 5, week: '周五' },
    { idx: 6, week: '周六' },
  ]

  // 获取当前日期
  const date = new Date()
  const currentDay = date.getDay() // 判断周几，0是周日

  // 调整日期到本周一
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - ((currentDay + 6) % 7))

  const result: IWeekDate[] = []

  // 复用一个 Date 对象
  const dayOfWeek = new Date(startOfWeek)

  for (let i = 0; i < 7; i++) {
    // 设置日期为本周的第几天
    dayOfWeek.setDate(startOfWeek.getDate() + i)

    // 格式化日期
    const year = dayOfWeek.getFullYear()
    const month = String(dayOfWeek.getMonth() + 1).padStart(2, '0')
    const day = String(dayOfWeek.getDate()).padStart(2, '0')
    const weekIndex = dayOfWeek.getDay()

    result.push({
      year,
      month,
      day,
      week: weekObj[weekIndex].week,
    })
  }

  return result
}

/* 蛇形命名转换成驼峰命名 */
export function convertSnakeToCamel(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(convertSnakeToCamel)
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
    acc[camelKey] = convertSnakeToCamel(obj[key])
    return acc
  }, {} as any)
}

/* 获取服务器图片 */
export const getServerImg = (path: string) => {
  return path ? `${SERVER_BASEURL}/${path}` : homeLogo
}

/* 加载服务器图片出错 */
export const handleLoadImgError = (event) => {
  event.target.src = homeLogo
}
