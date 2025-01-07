<template>
  <view
    class="wrapper"
    :style="{
      backgroundColor: props?.backgroundColor,
      paddingTop: px2rpx(paddingTop),
      height: wrapperHeight,
    }"
  >
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
/* store */
import { useSystemStore } from '@/store'
/* tools */
import { px2rpx } from '@/utils/tools'

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
const { top, height } = useSystem.systemInfo.capsule
const paddingTop = props.paddingType === 'top' ? top : top + height
const wrapperHeight = props?.paddingBottom
  ? `calc(100vh - ${px2rpx(props?.paddingBottom)})`
  : '100vh'

console.log('props.paddingBottom :>> ', props?.paddingBottom, wrapperHeight)

onShow(() => {
  console.log('paddingTop : top: height: >> ', paddingTop, top, height)
})
</script>

<style lang="scss" scoped>
.wrapper {
  @extend %flex-column;
  justify-content: flex-start;
  overflow: scroll;
}
</style>
