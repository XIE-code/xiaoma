<template>
  <view class="scroll-box">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
onShow(() => {
  console.log('scroll-box')
})
</script>

<style lang="scss" scoped>
.scroll-box {
  flex-grow: 1;
  overflow: auto;
}
</style>
