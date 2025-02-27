<template>
  <view class="empty">
    <image class="empty-img" :src="imageStatic.homeLogo" mode="scaleToFill" />
    <view class="empty-text">暂无相关信息</view>
  </view>
</template>

<script lang="ts" setup>
import { imageStatic } from '@/common/static'
</script>

<style lang="scss" scoped>
.empty {
  @extend %flex-column;
  gap: $rpx-32;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: $rpx-32;

  .empty-img {
    width: $rpx-90;
    height: $rpx-64;
  }

  .empty-text {
    @extend %font-size-lg;
    color: lightgray;
  }
}
</style>
