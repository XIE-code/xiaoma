<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '保养',
  },
}
</route>

<template>
  <wrapper paddingType="top" :paddingBottom="90">
    <view class="time-header">
      <view class="page-title">{{ currentDay.year }}年{{ currentDay.month }}月</view>
      <view class="week">
        <view
          :class="`day ${idx === curDayIdx ? 'day-selected' : ''}`"
          v-for="(item, idx) in calendar"
          :key="idx"
          @click="handleClickDate(idx)"
        >
          <span class="day-date">{{ item.week }}</span>
          <span class="day-num">{{ item.day }}</span>
        </view>
      </view>
      <view class="card-head">
        <view class="head-circle"></view>
        <view class="head-title">{{ getCardHeadTime() }}</view>
      </view>
    </view>

    <view class="content">
      <view class="scroll-box">
        <view
          :class="`card-item ${getItemBorderColor(item.status)}`"
          v-for="(item, idx) in maintenanceAddress"
          :key="idx"
        >
          <view class="item-time">
            <image :src="getItemSvg(item.status)" class="item-time-svg" mode="scaleToFill" />
            <text class="item-time-text">{{ item.time }}</text>
          </view>
          <view class="item-title">{{ item.title }}</view>
          <view class="item-maintenance">保养类型：{{ item.maintenanceType }}</view>
          <view class="item-address">
            <image class="item-address-svg" :src="addressSvg" mode="scaleToFill"></image>
            <text class="item-address-text">{{ item.address }}</text>
          </view>
        </view>
      </view>
    </view>
  </wrapper>

  <xm-tabbar></xm-tabbar>
</template>

<script lang="ts" setup>
/* component */
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'
import wrapper from '@/layouts/wrapper.vue'

// svg
import cubeRedSvg from '@/static/svg/cube-red.svg'
import cubeGreenSvg from '@/static/svg/cube-green.svg'
import cubeBlueSvg from '@/static/svg/cube-blue.svg'
import addressSvg from '@/static/svg/address.svg'

/* tools */
import { getWeekDates } from '@/utils/tools'
import type { IWeekDate } from '@/utils/tools'

onLoad(() => {
  uni.hideTabBar()
})

// week calendar
const calendar = reactive<IWeekDate[]>(getWeekDates())
const curDayIdx = ref<number>(new Date().getDay() - 1)
const currentDay = computed(() => {
  return calendar[curDayIdx.value]
})

/* 更换当前日期 */
const handleClickDate = (index: number) => {
  curDayIdx.value = index
}

/* 获取card头部时间 */
const getCardHeadTime = () => {
  const { year, month, day, week } = currentDay.value
  return `${year}/${month}/${day} ${week}`
}

// 保养地址
interface IMaintenanceAddress {
  status: string
  time: string
  title: string
  maintenanceType: string
  address: string
}
const maintenanceAddress = reactive<IMaintenanceAddress[]>([
  {
    status: '已完成',
    time: '10:00 - 10:30',
    title: '博罗县园洲镇均富房地产中介服务部',
    maintenanceType: '季度保养',
    address: '广东省惠州市博罗县中心北路与文广路交叉口北200米',
  },
  {
    status: '进行中',
    time: '11:30 - 12:30',
    title: '园洲花园10栋客梯',
    maintenanceType: '半月保养',
    address: '广东省惠州市博罗县中心北路与文广路交叉口北200米',
  },
  {
    status: '等待',
    time: '13:00  - 13:30',
    title: '园洲镇丰园酒店2号',
    maintenanceType: '半月保养',
    address: '广东省惠州市博罗县中心北路与文广路交叉口北200米',
  },
  {
    status: '已完成',
    time: '13:00  - 13:30',
    title: '园洲镇丰园酒店2号',
    maintenanceType: '半月保养',
    address: '广东省惠州市博罗县中心北路与文广路交叉口北200米',
  },
])

const getItemSvg = (status: string) => {
  return status === '已完成' ? cubeRedSvg : status === '进行中' ? cubeBlueSvg : cubeGreenSvg
}
const getItemBorderColor = (status: string) => {
  return status === '已完成' ? 'color-red' : status === '进行中' ? 'color-cyan' : 'color-blue'
}
</script>

<style lang="scss" scoped>
$rpx-11: px2rpx(11);
$rpx-19: px2rpx(19);
$rpx-23: px2rpx(23);
$rpx-27: px2rpx(27);
$rpx-28: px2rpx(28);
$rpx-30: px2rpx(30);
$rpx-32: px2rpx(32);

$rpx-38: px2rpx(38);
$rpx-58: px2rpx(58);
$rpx-64: px2rpx(64);

$rpx-129: px2rpx(129);

.time-header {
  flex-shrink: 0;
  .page-title {
    @extend %font-size-xl;
    height: $rpx-32;
    margin-left: $rpx-9;
    font-family: Almarai; //TODO: 字体
    font-weight: 700;
    line-height: 1.6;
    color: rgb(51, 51, 51);
  }
  // 周日历
  .week {
    @extend %flex-between;
    gap: $rpx-12;
    width: 100%;
    height: $rpx-58;
    margin-top: $rpx-6;

    .day {
      @extend %flex-column;
      width: calc((100% - ($rpx-12 * 6)) / 7);
      height: inherit;
      padding: $rpx-4 $rpx-8;
      border: $rpx-1 solid rgb(248, 237, 226);
      border-radius: $rpx-8;
      .day-date {
        width: $rpx-28;
        height: $rpx-23;

        // font-family: Lato; //TODO: app端字体缺失？
        font-size: $rpx-14;

        font-weight: 300;
        line-height: 160%;
        color: rgb(171, 171, 171);
        text-align: center;
        letter-spacing: 0%;
      }
      .day-num {
        font-family: Lato;
        font-size: 16px;
        font-weight: 500;
        line-height: 160%;
        color: rgb(121, 121, 121);
        text-align: center;

        letter-spacing: 0%;
      }
    }
    .day-selected {
      background: rgb(248, 237, 226);
      border-color: rgb(169, 139, 152);
    }
  }
  // card
  .card-head {
    @extend %flex-center;
    gap: $rpx-9;
    justify-content: flex-start;
    width: 100%;
    height: $rpx-64;

    padding: $rpx-11 $rpx-10 $rpx-27;
    margin-top: $rpx-38;
    background: $color-card-head;
    border-radius: $rpx-20 $rpx-20 0 0;
    .head-circle {
      width: $rpx-8;
      height: $rpx-8;
      margin-left: $rpx-9;
      background: rgb(169, 139, 152);
      border-radius: 50%;
    }
    .head-title {
      font-family: Lato;
      font-size: 16px;
      font-weight: 500;
      line-height: 160%;
      color: rgb(236, 236, 236);
      text-align: left;
      letter-spacing: 0%;
    }
  }
}
// content
.content {
  flex-grow: 1;

  margin-top: -$rpx-20;
  overflow: scroll;
  background: $color-white;
  border-radius: $rpx-20 $rpx-20 0 0;
  .scroll-box {
    @extend %flex-column;
    gap: $rpx-16;
    width: 100%;
    padding: $rpx-20 $rpx-30;
    overflow: scroll;
    .color-red {
      border-color: rgb(211, 47, 47);
    }
    .color-cyan {
      border-color: rgb(38, 191, 191);
    }
    .color-blue {
      border-color: rgb(137, 175, 255);
    }

    .card-item {
      @extend %flex-column;
      gap: $rpx-6;
      justify-content: flex-start;
      height: $rpx-129;
      padding: $rpx-12 $rpx-16 $rpx-12 $rpx-14;

      background: $color-white;
      border-style: solid;
      // border: $rpx-1 solid rgb(211, 47, 47);
      border-width: $rpx-1 $rpx-1 $rpx-1 $rpx-3;
      // border-radius: $rpx-12;
      border-radius: $rpx-14 $rpx-12 $rpx-12 $rpx-14; //TODO:待优化
      /* Small Drop */
      box-shadow: 0px $rpx-4 $rpx-8 0px rgba(28, 37, 44, 0.05);

      .item-time {
        @extend %flex-center;
        gap: $rpx-12;
        justify-content: flex-start;
        height: $rpx-18;
        .item-time-svg {
          width: $rpx-16;
          height: $rpx-16;
        }
        .item-time-text {
          font-family: Lato;
          font-size: 14px;
          font-weight: 400;
          line-height: 140%;
          color: rgba(154, 154, 154, 0.9);
          text-align: left;
          letter-spacing: 0px;
        }
      }
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
      .item-maintenance {
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        height: $rpx-32;
        font-family: Lato;
        font-size: $rpx-12;
        font-weight: 400;
        line-height: 140%;
        color: rgb(88, 90, 102);
        text-align: left;
        letter-spacing: 0px;
      }
      .item-address {
        @extend %flex-center;
        gap: $rpx-10;
        justify-content: flex-start;
        height: $rpx-23;
        .item-address-svg {
          width: $rpx-18;
          height: $rpx-18;
        }
        .item-address-text {
          @extend %ellipsis;
          @extend %font-size;
          font-family: 阿里巴巴普惠体;
          font-size: $rpx-11;
          line-height: $rpx-20;
          color: rgb(20, 21, 17);
        }
      }
    }
  }
}
</style>
