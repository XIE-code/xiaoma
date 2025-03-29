<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '保养',
  },
}
</route>

<template>
  <!-- 自定义布局组件，用于包裹整个页面内容。 -->
  <wrapper paddingType="top" :paddingBottom="90">
    <!-- 页面的头部区域，显示当前月份和一周的日历。 -->
    <view class="time-header">
      <!-- 显示当前选中日期的年份和月份 -->
      <view class="page-title">{{ currentDay.year }}年{{ currentDay.month }}月</view>
      <!-- 日历部分，显示一周的日期 -->
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
      <!-- 显示当前选中日期的详细时间信息，如“2024/10/10 星期四” -->
      <view class="card-head">
        <view class="head-circle"></view>
        <view class="head-title">{{ getCardHeadTime() }}</view>
      </view>
    </view>
    <!-- 页面的主要内容区域，显示保养任务列表。 -->
    <view class="content">
      <!-- 可滚动的容器，包含所有的保养任务项 -->
      <view class="scroll-box">
        <!-- 保养任务项的容器,点击触发签到操作-->
        <view
          class="card-item"
          @click="handleSignIn(item)"
          v-for="(item, idx) in maintenanceList"
          :key="idx"
        >
          <view class="item-title">{{ item.eleName }}</view>
          <view class="item-maintenance">保养类型：{{ item.maintType }}</view>
          <view class="item-maintenance">
            保养状态：
            <text :class="getItemInfoByMaintenanceType('color', item.isMaintain)">
              {{ getItemInfoByMaintenanceType('text', item.isMaintain) }}
            </text>
          </view>
          <view class="item-address">
            <image class="item-address-svg" :src="svgStatic.address" mode="scaleToFill"></image>
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
import dayjs from 'dayjs'
// svg
import { svgStatic } from '@/common/static'
/* tools */
import { getWeekDates } from '@/utils/tools'
import type { IWeekDate } from '@/utils/tools'
import { postMaintenanceList } from '@/service/maintenance/maintenance'
import { IMaintenanceItem, isMaintainType } from '@/service/maintenance/type'
import { signInPage } from '@/common/pages'

// week calendar
const calendar = reactive<IWeekDate[]>(getWeekDates())
const curDayIdx = ref<number>(new Date().getDay() - 1)
const currentDay = computed(() => calendar[curDayIdx.value])

/* 更换当前日期 */
const handleClickDate = (index: number) => {
  curDayIdx.value = index
  getMaintenanceList(
    currentDay.value.year + '-' + currentDay.value.month + '-' + currentDay.value.day,
  )
}

/* 获取card头部时间 */
const getCardHeadTime = () => {
  const { year, month, day, week } = currentDay.value
  return `${year}/${month}/${day} ${week}`
}

const maintenanceList = ref<IMaintenanceItem[]>([])

const getMaintenanceList = (dateString: string) => {
  postMaintenanceList({
    time: dateString,
    limit: 99,
    page: 1,
  })
    .then((result) => {
      maintenanceList.value = result.list
    })
    .catch((err) => {
      console.log('postMaintenanceList err :>> ', err)
    })
}

/* 根据item的状态返回颜色、文字 */
type itemType = 'color' | 'text'
const maintenanceColorArray = ['wait', 'finish', 'current', 'timeout']
const maintenanceTypeArray = ['待维保', '已维保', '进行中', '逾期签到']
/* 根据item的状态返回颜色、文字 */
const getItemInfoByMaintenanceType = (type: itemType, isMaintain: isMaintainType) => {
  if (type === 'color') {
    return `font-${maintenanceColorArray[isMaintain - 1]}`
  }

  if (type === 'text') {
    return maintenanceTypeArray[isMaintain - 1]
  }
}

const handleSignIn = (todo: IMaintenanceItem) => {
  uni.navigateTo({ url: signInPage + `?id=${todo.id}` })
}

onShow(() => {
  uni.hideTabBar()
  getMaintenanceList(dayjs().format('YYYY-MM-DD'))
})
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

$rpx-130: px2rpx(130);
$color-maintenance-title: rgb(51, 51, 51);
$color-day-border: rgb(248, 237, 226);
$color-date: rgb(171, 171, 171);
$color-date-num: rgb(121, 121, 121);
$color-date-select-bg: rgb(121, 121, 121);
$color-date-select-border: rgb(169, 139, 152);
$color-card-item-border: rgb(137, 175, 255);
$color-card-item-maintenance: rgb(88, 90, 102);
$color-address: rgb(20, 21, 17);
.time-header {
  flex-shrink: 0;
  .page-title {
    @extend %font-size-xl;
    height: $rpx-32;
    margin-left: $rpx-9;
    font-weight: 700;
    line-height: 1.6;
    color: $color-maintenance-title;
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
      align-items: center;
      width: calc((100% - ($rpx-12 * 6)) / 7);
      height: inherit;
      padding: $rpx-4 $rpx-8;
      border: $rpx-1 solid $color-day-border;
      border-radius: $rpx-8;
      .day-date {
        width: $rpx-28;
        height: $rpx-23;

        @extend %font-size-sm;
        font-weight: 300;
        line-height: 160%;

        color: $color-date;
        text-align: center;
      }

      .day-num {
        @extend %font-size;
        font-weight: 500;
        line-height: 160%;
        color: $color-date-num;
        text-align: center;
      }
    }

    .day-selected {
      background: $color-day-border;
      border-color: $color-date-select-border;
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
      background: $color-date-select-border;
      border-radius: 50%;
    }
    .head-title {
      @extend %font-size-base;
      font-weight: 500;
      line-height: 160%;
      color: rgb(236, 236, 236);
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

    .card-item {
      @extend %flex-column;
      gap: $rpx-6;
      justify-content: flex-start;
      height: $rpx-130;
      padding: $rpx-12 $rpx-16 $rpx-12 $rpx-14;

      background: $color-white;
      border-color: $color-card-item-border;
      border-style: solid;
      border-width: $rpx-1 $rpx-1 $rpx-1 $rpx-3;
      border-radius: $rpx-14 $rpx-12 $rpx-12 $rpx-14;
      box-shadow: 0px $rpx-4 $rpx-8 0px $color-card-item-box-shadow;

      .item-title {
        height: $rpx-20;
        @extend %font-size-base;
        font-weight: 700;
        line-height: 1.2;
        @extend %ellipsis;
        color: $color-black;
      }

      .item-maintenance {
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        height: $rpx-32;
        @extend %font-size-xs;
        line-height: 1.4;

        color: $color-card-item-maintenance;
      }

      .font-wait {
        color: $color-secondary;
      }
      .font-finish {
        color: $color-primary;
      }
      .font-current {
        color: $color-green;
      }
      .font-timeout {
        color: $color-bg-red;
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
          font-size: $rpx-11;
          line-height: $rpx-20;
          color: $color-address;
        }
      }
    }
  }
}
</style>
