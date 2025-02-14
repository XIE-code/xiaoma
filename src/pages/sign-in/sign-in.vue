<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '签到打卡',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="header">
      <view class="header-nav">
        <wd-icon
          name="arrow-left"
          @click="handleClickLeft"
          :size="px2rpx(24)"
          color="white"
        ></wd-icon>
        <view class="title">签到页面</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="scroll-box">
      <view class="container">
        <view>地点： {{ liftInfo.address }}</view>
        <view>电梯名称： {{ liftInfo.name }}</view>
        <view>维保类型： {{ maintenance.maintType }}</view>
        <view>电梯经度： {{ liftInfo.longitude }}</view>
        <view>电梯维度： {{ liftInfo.latitude }}</view>
        <view>当前经度： {{ currentPosition.longitude }}</view>
        <view>当前纬度： {{ currentPosition.latitude }}</view>
        <view>距离签到点： {{ signInDistance }} 米</view>

        <!-- #ifdef MP-WEIXIN -->
        <button hover-class="button-hover" @click="getLocation">获取位置</button>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <button>请在微信小程序授权获取定位</button>
        <!-- #endif -->
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* API */

import QQMapWX from './qqmap-wx-jssdk'

/* store */
import { useSystemStore } from '@/store'
/* service */
import { postLiftList, postMaintenanceDetail } from '@/service/lift/lift'
import { IElevatorInfo, ILiftListResponse, IMaintenanceBasis } from '@/service/lift/type'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
import { indexPage, liftDetailPage } from '@/common/pages'

const systemStore = useSystemStore()
const { capsule } = systemStore.systemInfo

const qqmapsdk = new QQMapWX({
  key: 'DJXBZ-NDSKQ-UB35D-23TNB-O3WYJ-GBBQ5',
})

console.log('new QQMapWX:>> ', QQMapWX)
console.log('qqmapsdk :>> ', qqmapsdk)

// 导航栏
function handleClickLeft() {
  systemStore.resetTabBarIdx()
  uni.switchTab({ url: indexPage })
}

const liftInfo = ref<Partial<IElevatorInfo>>({
  longitude: 0,
  latitude: 0,
})

const maintenance = ref<Partial<IMaintenanceBasis>>({
  maintType: '',
})

/* 地理位置 */
const currentPosition = ref({
  longitude: 0,
  latitude: 0,
})

// 定位距离
const signInDistance = ref(0)

onLoad((options) => {
  const liftId = options.id
  postMaintenanceDetail({ id: liftId })
    .then((result) => {
      liftInfo.value = result.ele
      maintenance.value = result.basis
    })
    .catch((err) => {
      console.log('postLiftGetRun err:>> ', err)
    })
})

// #ifdef MP-WEIXIN
wx.getSetting({
  success(res) {
    if (!res.authSetting['scope.userLocation']) {
      wx.authorize({
        scope: 'scope.userLocation',
        success() {
          // 用户已授权，可以调用wx.getLocation
          getLocation()
          calculateDistance()
        },
        fail() {
          // 用户拒绝授权
          wx.showToast({
            title: '需要开启定位权限',
            icon: 'none',
          })
        },
      })
    } else {
      // 用户已授权，直接调用wx.getLocation
      getLocation()
      calculateDistance()
    }
  },
})

// 计算距离
function calculateDistance() {
  if (!currentPosition.value.latitude || !currentPosition.value.longitude) {
    console.log('成功获取用户定位 :>> ')
  }
  const origin = {
    // 起点经纬度
    latitude: currentPosition.value.latitude, // 示例纬度
    longitude: currentPosition.value.longitude, // 示例经度
  }
  const destination = {
    // 终点经纬度
    latitude: liftInfo.value.latitude,
    longitude: liftInfo.value.longitude,
  }

  qqmapsdk.calculateDistance({
    from: `${origin.latitude},${origin.longitude}`,
    to: `${destination.latitude},${destination.longitude}`,
    mode: 'straight', // 计算直线距离
    success: (res) => {
      signInDistance.value = res.result.elements[0].distance

      console.log('计算距离成功', res)
    },
    fail: (err) => {
      console.error('计算距离失败', err)
    },
  })
}

// 获取定位
function getLocation() {
  wx.getLocation({
    type: 'wgs84', // 返回GPS坐标
    success(res) {
      currentPosition.value.longitude = res.longitude // 经度
      currentPosition.value.latitude = res.latitude // 纬度
      console.log(`当前纬度：${res.latitude}, 当前经度：${res.longitude}`)
    },
    fail(err) {
      console.error('获取定位失败', err)
    },
  })
}

// 获取详细地址信息
function getAddress(latitude, longitude) {
  qqmapsdk.reverseGeocoder({
    location: {
      latitude,
      longitude,
    },
    success(res) {
      console.log('详细地址信息', res)
      const address = res.result.formatted_addresses.recommend
      console.log('详细地址', address)
    },
    fail(err) {
      console.error('获取地址失败', err)
    },
  })
}

// #endif

/* 根据 is_online 获取颜色、文字 */
const getItemOnline = (item: ILiftListResponse, type: 'color' | 'text' | 'class' | 'icon') => {
  const isOnline = item.isOnline === '1'
  switch (type) {
    case 'color':
      return isOnline ? 'rgb(83, 157, 243)' : 'rgb(171, 171, 171)'
    case 'class':
      return isOnline ? 'item-online' : 'item-offline'
    case 'icon':
      return isOnline ? 'check-circle-filled' : 'close-circle-filled'
    case 'text':
      return isOnline ? '在线' : '离线'
    default:
      return '' // 防止未知类型的意外情况
  }
}

/* 点击电梯信息、跳转电梯详情页 */
const handleClickItem = (item: ILiftListResponse) => {
  console.log('addElevator :>> click item', item)
  uni.navigateTo({ url: `${liftDetailPage}?elevatorId=${item.elevatorId}` })
}
</script>

<style lang="scss" scoped>
$rpx-11: px2rpx(11);
$rpx-17: px2rpx(17);
$rpx-19: px2rpx(19);

$rpx-92: px2rpx(92);

.header {
  @extend %flex-column;
  gap: $rpx-10;
  padding: 0 $rpx-24 $rpx-10;

  .header-nav {
    @extend %flex-center;
    gap: $rpx-16;
    justify-content: flex-start;
    height: $rpx-32;
    background: $color-secondary;

    .title {
      @extend %font-size-xl;
      @extend %flex-center;
      height: $rpx-28;
      color: $color-white;
    }
  }

  .search-bar {
    @extend %flex-center;
    height: $rpx-40;
    padding: $rpx-8 $rpx-12;
    background: $color-white;
    border: $rpx-1 solid $color-border;
    border-radius: $rpx-20;

    .search-input {
      @extend %font-size-xs;
      flex-grow: 1;
      height: $rpx-24;
      color: $color-placeholder;
    }

    .search-btn {
      @extend %btn-reset;
      @extend %flex-center;
      flex-shrink: 0;
      width: $rpx-24;
      height: $rpx-24;
      background: $color-primary;
      border-radius: $rpx-8;
    }
  }
}

.scroll-box {
  flex-grow: 1;
  overflow: hidden;
  /* 内容区域 */
  .container {
    @extend %flex-column;
    gap: $rpx-16;
    justify-content: flex-start;
    height: 100%;
    overflow: scroll;
    background: $color-white;
    border-radius: $rpx-20 $rpx-20 0 0;
    @extend %padding-base;

    .card-item {
      position: relative;
      @extend %flex-column;
      gap: $rpx-6;
      justify-content: flex-start;
      padding: $rpx-12 $rpx-16 $rpx-12 $rpx-14;

      background: $color-white;
      border-color: $color-secondary;
      border-style: solid;
      border-width: $rpx-1 $rpx-1 $rpx-1 $rpx-3;
      border-radius: $rpx-14 $rpx-12 $rpx-12 $rpx-14; //TODO:待优化
      box-shadow: 0px $rpx-4 $rpx-8 0px rgba(28, 37, 44, 0.05);

      .item-title {
        height: $rpx-19;
        font-size: 16px;
        font-weight: 700;
        line-height: 120%;
        color: rgb(0, 0, 0);
        text-align: left;
        letter-spacing: 0px;
      }
      .item-status {
        @extend %flex-between;
        position: absolute;
        top: $rpx-14;
        right: $rpx-24;
        gap: $rpx-8;
        .item-online {
          color: rgb(83, 157, 243);
        }

        .item-offline {
          color: rgb(171, 171, 171);
        }
        .item-status-text {
          font-family: Lato;
          font-size: 12px;
          font-weight: 400;
          line-height: 140%;
          text-align: left;
          letter-spacing: 0px;
        }
      }

      .item-text {
        @extend %ellipsis;
        height: $rpx-18;
        font-family: Lato;
        font-size: 12px;
        font-weight: 400;
        line-height: 140%;
        color: rgb(88, 90, 102);
        text-align: left;
        letter-spacing: 0px;
      }
    }
  }
}
</style>
