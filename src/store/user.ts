import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const initState = {
  user_id: 0, // 用户ID
  token: '', // 访问令牌
  company_id: 0, // 公司ID
  user_name: '', // 用户名
  email: '', // 邮箱
  realname: '', // 姓名
  phone: '', // 电话
  office_phone: '', // 工作电话
  sex: 0, // 性别
  identity: '', // 身份
  head_img: '', // 头像
  jobs: 0, // 职位
  role_id: 0, // 角色ID
  role: 0, // 角色
  company_type: 0, // 公司类型
  company_name: '', // 公司名称
}
export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<any>({ ...initState })

    const setUserInfo = (val: any) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }
    const isLogined = computed(() => !!userInfo.value.token)

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      reset,
    }
  },
  {
    persist: true,
  },
)
