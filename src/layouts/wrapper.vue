<template>
  <view
    class="wrapper"
    :style="{
      backgroundColor: props?.backgroundColor,
      paddingTop: px2rpx(paddingTop),
      height: `calc(100vh - ${px2rpx(props.paddingBottom)})`,
    }"
  >
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
/* tools */
import { px2rpx } from '@/utils/tools'
/* store */
import { useSystemStore } from '@/store'

/* 根据prop判断间距是Top,还是top+height */
const props = withDefaults(
  defineProps<{
    paddingType: 'top' | 'height'
    backgroundColor?: string
    paddingBottom?: number
  }>(),
  { paddingType: 'top', backgroundColor: 'white', paddingBottom: 0 },
)

// 获取屏幕边界到安全区域距离
const useSystem = useSystemStore()
const {
  capsule: { top, height },
} = useSystem.systemInfo
const paddingTop = props.paddingType === 'top' ? top : top + height
onShow(() => {
  console.log('paddingTop : top: height: >> ', paddingTop, top, height)
})
</script>

<style lang="scss" scoped>
//
.wrapper {
  @extend %flex-column;
  justify-content: flex-start;
  overflow: scroll;

  // border: 2px solid red;
}
</style>
