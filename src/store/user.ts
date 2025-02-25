import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ILoginResponse } from '@/service/login/type'

const initState: ILoginResponse = {
  userId: 0, // 用户ID
  token: '', // 访问令牌
  companyId: 0, // 公司ID
  userName: '', // 用户名
  email: '', // 邮箱
  realname: '', // 姓名
  phone: '', // 电话
  officePhone: '', // 工作电话
  sex: 0, // 性别
  identity: '', // 身份
  headImg: '', // 头像
  jobs: 0, // 职位
  roleId: 0, // 角色ID
  role: 0, // 角色
  companyType: 0, // 公司类型
  companyName: '', // 公司名称
}
export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = reactive<ILoginResponse>({ ...initState })

    const setUserInfo = (val: ILoginResponse) => {
      Object.assign(userInfo, val)
    }

    const resetUserInfo = () => {
      Object.assign(userInfo, initState)
    }

    const getUserInfo = () => {
      return userInfo
    }

    const isLogin = computed(() => !!userInfo.token)

    return {
      userInfo,
      getUserInfo,
      setUserInfo,
      resetUserInfo,
      isLogin,
    }
  },
  {
    persist: true,
  },
)
