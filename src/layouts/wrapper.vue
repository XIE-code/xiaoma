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
const props = defineProps({
  paddingType: {
    type: String as PropType<'top' | 'height'>,
    default: 'top',
  },
  backgroundColor: {
    type: String,
    default: 'white',
  },
  paddingBottom: {
    type: Number,
    default: 0,
  },
  paddingLeft: {
    type: Number,
    default: 0,
  },
  paddingRight: {
    type: Number,
    default: 0,
  },
  gap: {
    type: Number,
    default: 0,
  },
})

// 获取屏幕边界到安全区域距离
const useSystem = useSystemStore()
const { top, height } = useSystem.systemInfo.capsule
const paddingTop = props.paddingType === 'top' ? top : top + height

const wrapperHeight = props?.paddingBottom
  ? `calc(100vh - ${px2rpx(props?.paddingBottom)})`
  : '100vh'
</script>

<style lang="scss" scoped>
.wrapper {
  @extend %flex-column;
  justify-content: flex-start;
  overflow: scroll;
}
</style>
