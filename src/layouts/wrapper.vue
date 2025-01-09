<template>
  <view
    class="wrapper"
    :style="{
      backgroundColor: props?.backgroundColor,
      paddingTop: px2rpx(paddingTop),
      height: wrapperHeight,
      paddingLeft: px2rpx(props?.paddingLeft),
      paddingRight: px2rpx(props?.paddingRight),
      gap: px2rpx(props?.gap),
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
    paddingLeft?: number
    paddingRight?: number
    gap?: number
  }>(),
  {
    paddingType: 'top',
    backgroundColor: 'white',
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    gap: 0,
  },
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
