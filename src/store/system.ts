import { defineStore } from 'pinia'
import { reactive } from 'vue'

const initState: ISystemInfo = { tabBarIdx: 0, capsule: { top: 0, height: 0 } }

export const useSystemStore = defineStore(
  'system',
  () => {
    const systemInfo = reactive<ISystemInfo>({ ...initState })

    /* 重置systemInfo */
    const resetSystemInfo = () => {
      Object.assign(systemInfo, initState)
    }

    /* 获取tab栏当前索引 */
    const getTabBarIdx = () => {
      return systemInfo.tabBarIdx
    }
    /* 设置tab栏当前索引 */
    const setTabBarIdx = (idx: number) => {
      systemInfo.tabBarIdx = idx
    }

    /* 重置tab栏当前索引 */
    const resetTabBarIdx = () => {
      systemInfo.tabBarIdx = 0
    }

    /* 设置 navigatorPadding */
    const setNavigatorPadding = (top: number, height: number) => {
      systemInfo.capsule = { top, height }
    }

    /* 获取 navigatorPadding */
    const getNavigatorPadding = computed(() => {
      const { top = 0, height = 0 } = systemInfo.capsule
      return top + height
    })

    /* 重置 navigatorPadding */
    const resetNavigatorPadding = () => {
      systemInfo.capsule = initState.capsule
    }

    return {
      systemInfo,
      resetSystemInfo,
      getTabBarIdx,
      setTabBarIdx,
      resetTabBarIdx,
      getNavigatorPadding,
      setNavigatorPadding,
      resetNavigatorPadding,
    }
  },
  {
    persist: true,
  },
)
