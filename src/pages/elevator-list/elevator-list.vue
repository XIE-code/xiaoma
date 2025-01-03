<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '电梯列表',
  },
}
</route>

<template>
  <wrapper paddingType="top">
    <view class="navigation">
      <wd-icon name="arrow-left" @click="handleClickLeft" size="20px" color="black"></wd-icon>
      <view class="nav-search">
        <input
          confirm-type="search"
          class="nav-search-input"
          @confirm="handleSearch"
          placeholder="请输入"
        />

        <button class="nav-search-btn">
          <wd-icon name="search" size="20rpx" color="white"></wd-icon>
        </button>
      </view>
    </view>
    <!-- 内容区域 -->
    <view class="content">
      <view class="scroll-box">
        <view class="container">
          <view
            class="card-item"
            v-for="(item, idx) in liftList"
            :key="idx"
            @click="handleClickItem(item)"
          >
            <!-- 名称 -->
            <view class="item-title">{{ item.name }}</view>
            <!-- 状态 -->
            <view class="item-status">
              <wd-icon
                :name="getItemOnline(item, 'icon')"
                size="16px"
                :color="getItemOnline(item, 'color')"
              ></wd-icon>
              <text :class="['item-status-text', getItemOnline(item, 'class')]">
                {{ getItemOnline(item, 'text') }}
              </text>
            </view>
            <!-- 电梯编号 -->
            <view class="item-text">电梯编号：{{ item.elevator_number }}</view>
            <!-- 使用单位 -->
            <view class="item-text">使用单位：{{ item.company_name }}</view>
            <!-- 维保人员 -->
            <view class="item-text">维保人员：{{ item.realname }}</view>
            <!-- 电梯地址 -->
            <view class="item-text">电梯地址：{{ item.address }}</view>
          </view>
        </view>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
import { useSystemStore } from '@/store'
/* svg */
import { ILiftListResponse } from '@/service/elevator'
import backSvg from '@/static/svg/back.svg'
import searchSvg from '@/static/svg/search.svg'
/* components */
import wrapper from '@/layouts/wrapper.vue'

onShow(() => {
  console.log('addElevator :>> ')
})

const systemStore = useSystemStore()
// 导航栏
function handleClickLeft() {
  systemStore.resetTabBarIdx()
  uni.switchTab({ url: '/pages/index/index' })
}

function handleSearch() {
  console.log('触发搜索事件 :>> ')
}
const staticLiftData = {
  elevator_id: 1584,
  register_code: '',
  name: ' 测 试 电 梯 1',
  elevator_number: 230000043,
  address: '重庆市市辖区九龙坡区石油路',
  is_online: '0',
  company_name: '重庆使用单位',
  realname: '朱渝光',
  phone: 13883587879,
  server_ip: '::1',
}
// 内容区域
const liftList = reactive<ILiftListResponse[]>([
  staticLiftData,
  staticLiftData,
  staticLiftData,
  staticLiftData,
  staticLiftData,
  staticLiftData,
  staticLiftData,
  staticLiftData,
  staticLiftData,
])

/* 根据 is_online 获取颜色、文字 */
const getItemOnline = (item: ILiftListResponse, type: 'color' | 'text' | 'class' | 'icon') => {
  const isOnline = item.is_online === '1'
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
  uni.navigateTo({ url: '/pages/elevator-detail/elevator-detail' })
}
</script>

<style lang="scss" scoped>
$rpx-11: px2rpx(11);
$rpx-19: px2rpx(19);
$rpx-17: px2rpx(17);

$rpx-48: px2rpx(48);
// 导航栏
.navigation {
  @extend %flex-center;
  flex-shrink: 0;
  gap: $rpx-16;
  justify-content: flex-start;
  padding: 0 $rpx-24;
  background: $color-white;

  .nav-back {
    @extend %flex-center;
    width: $rpx-20;
    height: $rpx-20;
    color: black;
  }

  .nav-search {
    position: relative;
    .nav-search-input {
      height: $rpx-48;
      padding: $rpx-12 $rpx-16;
      font-family: Asap;
      font-size: $rpx-16;
      font-weight: 400;
      line-height: $rpx-24;
      color: rgb(108, 108, 108);
      text-align: left;
      letter-spacing: 0%;
      background: $color-white;
      border: $rpx-1 solid rgb(227, 227, 227);
      border-radius: $rpx-10;
    }

    .nav-search-btn {
      position: absolute;
      top: $rpx-8;
      right: $rpx-16;
      width: $rpx-32;
      height: $rpx-32;
      background: $color-secondary;
      border-radius: $rpx-10;
      @extend %btn-reset;
      @extend %flex-center;
    }
  }
}
.content {
  flex-grow: 1;
  margin-top: $rpx-16;
  overflow: scroll;
  .scroll-box {
    /* 内容区域 */
    .container {
      @extend %flex-column;
      @extend %padding-base;

      gap: $rpx-16;
      padding-top: 0;
      background: $color-white;
      border-radius: $rpx-20 $rpx-20 0 0;

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
          font-family: Almarai;
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
}
</style>
