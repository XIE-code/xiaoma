<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>
<template>
  <wrapper paddingType="top" :paddingBottom="90" :paddingLeft="20" :paddingRight="20" :gap="24">
    <view class="info">
      <image class="avatar" :src="getServerImg(userInfo.headImg)" mode="scaleToFill"></image>
      <view class="info-data">
        <view class="info-name">{{ userInfo.realname }}</view>
        <view class="info-other">{{ userInfo.phone }}&nbsp;|&nbsp;{{ userInfo.companyName }}</view>
      </view>
    </view>

    <!-- 暂时不展示 -->
    <!-- <view class="state">
      <view class="box" v-for="item in elevatorList" :key="item.name">
        <text class="box-name">{{ item.name }}</text>
        <text class="box-value">{{ item.value }}</text>
      </view>
    </view> -->

    <view class="certificate">
      <image class="certificate-star" src="@/static/svg/star.svg" mode="scaleToFill" />
      <view class="certificate-left">
        <image class="certificate-icon" src="@/static/svg/certificate.svg" mode="scaleToFill" />
        <text class="certificate-text">个人操作证管理</text>
      </view>
      <button class="certificate-btn">查看</button>
    </view>

    <view class="content">
      <wd-cell
        clickable
        center
        size="large"
        is-link
        :to="item.path"
        :title="item.label"
        :key="idx"
        class="item"
        custom-title-class="item-title"
        custom-value-class="item-value"
        v-for="(item, idx) in routerList"
      >
        <template #icon>
          <image :src="item.icon" class="item-icon" mode="aspectFit" />
        </template>
      </wd-cell>
    </view>

    <view class="login-out">
      <button class="login-out-btn" @click="handleLoginOut">退出登录</button>
    </view>
  </wrapper>
  <xm-tabbar></xm-tabbar>
</template>

<script lang="ts" setup>
/* components */
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'
import wrapper from '@/layouts/wrapper.vue'
/* store */
import { useSystemStore, useUserStore } from '@/store/index'
/* utils */
import { getServerImg } from '@/utils/tools'
/* info */
import { IRouterItem, routerListInfo } from './personal-info'
import { loginPage } from '@/common/pages'
defineOptions({
  name: 'personal',
})

const userStore = useUserStore()
const userInfo = reactive(userStore.getUserInfo())

const routerList = reactive<IRouterItem[]>(routerListInfo)
const elevatorList = reactive([])

const systemStore = useSystemStore()

const handleLoginOut = () => {
  systemStore.resetSystemInfo()
  systemStore.setTabBarIdx(0)
  userStore.resetUserInfo()
  uni.navigateTo({ url: loginPage })
}

onLoad(() => {
  uni.hideTabBar()
})
</script>

<style lang="scss">
$rpx-15: px2rpx(15);
$rpx-87: px2rpx(87);

$rpx-120: px2rpx(120);
$rpx-128: px2rpx(128);
$rpx-144: px2rpx(144);

$color-bg-gold-50: rgba(255, 176, 23, 0.5);

.info {
  @extend %flex-center;
  justify-content: flex-start;
  height: $rpx-64;
  margin-top: $rpx-30;

  .avatar {
    flex-shrink: 0;
    @extend %flex-center;
    width: $rpx-64;
    height: $rpx-64;
    border-radius: 50%;
  }

  .info-data {
    flex-grow: 1;
    @extend %flex-column;
    justify-content: space-between;
    height: $rpx-64;
    padding: $rpx-4 $rpx-16;
    overflow: hidden;

    .info-name {
      @extend %font-size-xl;
      color: $color-card-head;
    }

    .info-other {
      @extend %font-size-sm;
      color: $color-gray-70;
      @extend %ellipsis;
    }
  }
}

.state {
  @extend %flex-center;
  gap: $rpx-12;
  width: 100%;
  padding: $rpx-16 0;

  .box {
    @extend %flex-column;
    gap: $rpx-8;
    align-items: center;
    justify-content: space-between;

    width: calc((100% - $rpx-24) / 3);
    height: 100%;

    .box-name {
      @extend %font-size-sm;
      width: 100%;
      height: $rpx-20;
      overflow: visible;
      color: $color-gray-70;
      text-align: center;
      white-space: nowrap;
    }
    .box-value {
      @extend %font-size-xl;
      font-weight: 600;
    }
  }
}

.certificate {
  position: relative;
  flex-shrink: 0;
  gap: $rpx-12;
  width: 100%;
  height: $rpx-64;
  padding: $rpx-16;
  overflow: hidden;
  font-weight: 600;
  border-radius: $rpx-12;
  box-shadow: 0 $rpx-4 $rpx-16 0 $color-bg-red-50;
  @extend %flex-between;
  @extend %font-size-sm;

  &::before {
    @extend %absolute;
    background: $color-bg-red;
  }

  &::after {
    @extend %absolute;
    background: linear-gradient(to right, $color-white, $color-white-50);
    opacity: 0.5;
  }

  .certificate-left {
    z-index: 1;
    @extend %flex-between;
    gap: $rpx-12;

    .certificate-icon {
      width: $rpx-32;
      height: $rpx-32;
    }
    .certificate-text {
      color: $color-gray-90;
    }
  }

  .certificate-btn {
    z-index: 1;
    @extend %flex-center;
    height: $rpx-32;
    padding: $rpx-6 $rpx-16;
    margin-right: $rpx-15;
    @extend %font-size-sm;
    font-weight: 600;
    color: $color-white;

    background-color: $color-bg-red;
    border-radius: $rpx-16;
  }

  .certificate-star {
    position: absolute;
    top: -$rpx-3;
    right: -$rpx-12;
    z-index: 1;
    width: $rpx-87;
    height: $rpx-87;
  }
}

.content {
  @extend %flex-column;
  gap: $rpx-24;
  justify-content: flex-start;
  padding: $rpx-16;

  background: $color-bg-gold-50;
  border: $rpx-1 solid $color-bg-gold-50;
  border-radius: $rpx-12;

  :deep(.wd-cell.is-large.is-center) {
    height: $rpx-32;
    padding: 0;
    background-color: transparent;
    .wd-cell__wrapper {
      padding: 0;

      .item-icon {
        width: $rpx-32;
        height: $rpx-32;
      }

      .item-title {
        margin-left: $rpx-12;

        @extend %font-size-sm;
        font-weight: 600;
        line-height: $rpx-32;
        color: $color-gray-90;
      }

      .wd-cell__arrow-right {
        color: $color-gray-90;
      }
    }
  }
}

.login-out {
  display: flex;
  justify-content: flex-end;

  .login-out-btn {
    @extend %flex-center;
    @extend %btn-reset;

    width: $rpx-128;
    height: $rpx-48;

    @extend %font-size-base;
    font-weight: 600;
    color: $color-bg-red;
    background: transparent;
  }
}
</style>
