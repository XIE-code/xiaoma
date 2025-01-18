<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '电梯列表',
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
        <view class="title">电梯列表</view>
      </view>
      <view class="search-bar">
        <input
          confirm-type="search"
          @confirm="handleSearch"
          class="search-input"
          placeholder="请输入"
        />
        <button class="search-btn">
          <wd-icon name="search" color="white" :size="px2rpx(12)"></wd-icon>
        </button>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="scroll-box">
      <view class="container">
        <view
          class="card-item"
          v-for="(item, idx) in liftList"
          :key="idx"
          @click="handleClickItem(item)"
        >
          <view class="item-title">{{ item.name }}</view>
          <view class="item-status">
            <wd-icon
              :name="getItemOnline(item, 'icon')"
              :size="px2rpx(16)"
              :color="getItemOnline(item, 'color')"
            ></wd-icon>
            <text :class="['item-status-text', getItemOnline(item, 'class')]">
              {{ getItemOnline(item, 'text') }}
            </text>
          </view>
          <view class="item-text">电梯编号：{{ item.elevatorNumber }}</view>
          <view class="item-text">使用单位：{{ item.companyName }}</view>
          <view class="item-text">维保人员：{{ item.realname }}</view>
          <view class="item-text">电梯地址：{{ item.address }}</view>
        </view>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* store */
import { useSystemStore } from '@/store'
/* service */
import { ILiftListResponse, postLiftList } from '@/service/elevator'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'

const systemStore = useSystemStore()
const { capsule } = systemStore.systemInfo
// 导航栏
function handleClickLeft() {
  systemStore.resetTabBarIdx()
  uni.switchTab({ url: '/pages/index/index' })
}

function handleSearch() {
  console.log('触发搜索事件 :>> ')
}
const staticLiftData: ILiftListResponse = {
  elevatorId: 1584,
  registerCode: '',
  name: ' 测 试 电 梯 1',
  elevatorNumber: 230000043,
  address: '重庆市市辖区九龙坡区石油路',
  isOnline: '0',
  companyName: '重庆使用单位',
  realname: '朱渝光',
  phone: 13883587879,
  serverIp: '::1',
}
// 内容区域
const liftList = ref<ILiftListResponse[]>([])

// TODO： 下拉刷新
postLiftList({
  village_id: '',
  lift_name: '',
  limit: '999',
  page: '1',
  // state: '0',
})
  .then((result) => {
    liftList.value = result
  })
  .catch((err) => {
    console.log('postLiftList err :>> ', err)
  })

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
  uni.navigateTo({ url: `/pages/elevator-detail/elevator-detail?elevatorId=${item.elevatorId}` })
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
