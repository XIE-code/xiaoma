<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <wrapper paddingType="height" :paddingBottom="90">
    <!-- 导航栏 -->
    <view class="navigation">
      <image class="logo" :src="imgHomeLogo" mode="aspectFit">
        <template #error>
          <view class="error-wrap">加载失败</view>
        </template>
        <template #loading>
          <view class="loading-wrap">
            <wd-loading />
          </view>
        </template>
      </image>
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
      <image :src="notificationSvg" mode="aspectFit" class="notification-icon" />
    </view>
    <!-- 滚动效果 -->
    <view class="scroll-box">
      <!-- 通知栏 -->
      <view class="notification">
        <view class="notification-container">
          <view class="fix-elevator-number">
            <text class="text">今日维保电梯数量</text>
            <text class="number">100</text>
          </view>
          <view class="separator"></view>
          <view class="breakdown-elevator-number">
            <text class="text">故障电梯数量</text>
            <text class="number">10</text>
          </view>
        </view>
      </view>

      <!-- 轮播图 -->
      <!-- :indicator="{ type: 'dots-bar' } as Partial<SwiperNavProps>" -->
      <view class="card-swiper">
        <wd-swiper
          :autoplay="false"
          v-model:current="current"
          :height="px2rpx(90)"
          custom-item-class="custom-item-class"
          custom-indicator-class="custom-indicator-class"
          :indicator="{ type: 'dots-bar' }"
          :list="swiperList"
          :previousMargin="px2rpx(30)"
          :nextMargin="px2rpx(60)"
          @click="handleSwiperItemClick"
        ></wd-swiper>
      </view>
      <!-- Gird -->
      <view style="overflow: auto" class="custom-class-grid">
        <wd-grid :column="2" clickable>
          <wd-grid-item
            use-icon-slot
            use-text-slot
            v-for="item in elevatorList"
            :key="item.id"
            :iconSize="px2rpx(55)"
            custom-class="custom-class-item"
            link-type="navigateTo"
            :url="item.path"
          >
            <template #icon>
              <image :src="item.url" mode="aspectFit" class="grid-item-img" />
            </template>
            <template #text>
              <text class="grid-item-text">
                {{ item.name }}
              </text>
            </template>
          </wd-grid-item>
        </wd-grid>
      </view>

      <!-- 待办事项 -->
      <view class="schedule">
        <text class="schedule-title">今日维保计划</text>
        <view class="schedule-item" :key="item.id" v-for="item in todoList">
          <view class="item-header">
            <image
              :src="getItemInfoByStatus('svg', item.status)"
              mode="aspectFit"
              class="item-svg"
            />
            <view class="item-header-right">
              <view class="item-time">{{ item.time }}</view>
              <view :class="['item-status', getItemInfoByStatus('color', item.status)]">
                {{ getItemInfoByStatus('text', item.status) }}
              </view>
            </view>
          </view>
          <image :src="dashedSvg" class="item-divider" mode="scaleToFill" />
          <view class="item-content">
            <view class="item-elevator-name">电梯名称：{{ item.name }}</view>
            <view class="item-elevator-address">详细地址：{{ item.address }}</view>
          </view>
        </view>
      </view>
    </view>
  </wrapper>
  <xmTabbar></xmTabbar>
</template>

<script lang="ts" setup>
/* components */
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'
import Wrapper from '@/layouts/wrapper.vue'
/* store */
import { useSystemStore } from '@/store'
/* tools */
import { px2rpx } from '@/utils/tools'
/* image */
import imgHomeLogo from '@img/home-logo.png'
import imgCarouselFirst from '../../static/image/image1.png'
import imgCarouselSecond from '../../static/image/image2.png'
/* svg */
import addElevatorSvg from '@/static/svg/add-elevator.svg'
import dashedSvg from '@/static/svg/dashed.svg'
import filesSvg from '@/static/svg/files.svg'
import knowledgeSvg from '@/static/svg/knowledge.svg'
import monitorSvg from '@/static/svg/monitor.svg'
import notificationErrorSvg from '@/static/svg/notification-error.svg'
import notificationPrimarySvg from '@/static/svg/notification-primary.svg'
import notificationSecondarySvg from '@/static/svg/notification-secondary.svg'
import notificationSvg from '@/static/svg/notification.svg'

defineOptions({
  name: 'Home',
})

onLoad(() => {
  uni.hideTabBar()
})

function handleSearch() {
  console.log('触发搜索事件 :>> ')
}

//  轮播图
const current = ref(0)
const swiperList = reactive([
  imgCarouselFirst,
  imgCarouselSecond,
  imgCarouselFirst,
  imgCarouselSecond,
])

const handleSwiperItemClick = (params) => {
  uni.navigateTo({ url: '/pages/shop/shop' })
}

// 电梯添加、档案资料、电梯监控
const elevatorList = reactive([
  {
    id: 1,
    name: '电梯监控',
    url: monitorSvg,
    path: '',
  },
  {
    id: 2,
    name: '档案资料',
    url: filesSvg,
    path: '/pages/elevator-list/elevator-list',
  },
  {
    id: 3,
    name: '电梯知识库',
    url: knowledgeSvg,
    path: '/pages/knowledge-company/knowledge-company',
  },
  {
    id: 4,
    name: '添加电梯',
    url: addElevatorSvg,
    path: '/pages/add-elevator/add-elevator',
  },
])
// 点击事件
function handleItemClick(event: Event) {
  console.log('event :>> ', event)
}

// schedule
interface ITodoItem {
  id: number
  name: string
  address: string
  time: string
  status: 'timeout' | 'current' | 'wait'
}

const todoList = reactive<ITodoItem[]>([
  {
    id: 1,
    time: '10：00-10：40',
    status: 'timeout',
    name: '园洲镇丰园酒店2号',
    address: '广东省惠州市博罗县中心北路与文广路交叉口北200米',
  },
  {
    id: 2,
    time: '11：00-11：40',
    status: 'current',
    name: '园洲镇丰园酒店2号',
    address: '广东省惠州市博罗县中心北路与文广路交叉口北200米',
  },
  {
    id: 3,
    time: '13：00-13：40',
    status: 'wait',
    name: '园洲镇丰园酒店2号',
    address: '广东省惠州市博罗县中心北路与文广路交叉口北200米',
  },
])

/* 根据item的svg状态返回svg、颜色、文字 */
type itemType = 'svg' | 'color' | 'text'
type itemStatus = 'timeout' | 'current' | 'wait'

/* status-svg */
const svgMap = {
  timeout: notificationErrorSvg,
  current: notificationPrimarySvg,
  wait: notificationSecondarySvg,
}
/* status-文字 */
const textMap = {
  timeout: '已超时',
  current: '进行中',
  wait: '待处理',
}

/* 根据item的svg状态返回svg、颜色、文字 */
const getItemInfoByStatus = (type: itemType, status: itemStatus) => {
  if (type === 'svg') {
    return svgMap[status]
  }

  if (type === 'color') {
    return `font-color-${status}`
  }

  if (type === 'text') {
    return textMap[status]
  }
}
</script>

<style lang="scss" scoped>
$rpx-1-5: px2rpx(1.5);
$rpx-19: px2rpx(19);
$rpx-22: px2rpx(22);

$rpx-45: px2rpx(45);
$rpx-55: px2rpx(55);
$rpx-72: px2rpx(72);

$color-svg-timeout: rgb(238, 61, 96);
$color-svg-wait: rgb(30, 32, 34);
$color-text-blue: rgb(28, 106, 228);

// 导航栏
.navigation {
  @extend %flex-center;
  flex-shrink: 0;
  gap: $rpx-16;
  height: $rpx-72;
  @extend %padding-base;

  .logo {
    flex-shrink: 0;
    width: $rpx-80;
    height: $rpx-40;
  }

  .search-bar {
    @extend %flex-center;
    flex-grow: 1;
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

  .notification-icon {
    width: $rpx-20;
    height: $rpx-20;
  }
}

.scroll-box {
  flex-grow: 1;
  overflow: scroll;
  @extend %padding-base;

  // 通知栏
  .notification {
    margin-top: -$rpx-8;
    .notification-container {
      @extend %flex-center;
      gap: $rpx-16;
      padding: $rpx-16;

      background: $color-white;
      border-radius: $rpx-20;
      box-shadow: 0 $rpx-4 $rpx-28 0 $color-black-05;

      .fix-elevator-number {
        @extend %flex-column;
        flex-grow: 1;
        gap: $rpx-8;
        height: $rpx-50;
        .text {
          @extend %font-size-base;
          height: $rpx-18;
          color: $color-title;
        }
        .number {
          @extend %font-size-lg;
          height: $rpx-24;
          color: $color-title;
        }
      }

      .separator {
        flex-shrink: 0;
        width: 0;
        height: $rpx-50;
        border: $rpx-1 solid rgb(227, 227, 227);
      }

      .breakdown-elevator-number {
        @extend %flex-column;
        flex-grow: 1;
        gap: $rpx-8;
        height: $rpx-50;
        .text {
          @extend %font-size-base;
          height: $rpx-18;
          color: $color-title;
        }
        .number {
          @extend %font-size-lg;
          height: $rpx-24;
          color: $color-title;
        }
      }
    }
  }
  // 轮播图
  .card-swiper {
    margin: $rpx-16 0;
    --wot-swiper-radius: $rpx-8;
    --wot-swiper-item-padding: 0 $rpx-24;
    --wot-swiper-nav-dot-color: rgb(198, 198, 198);
    --wot-swiper-nav-dot-active-color: rgb(242, 101, 34);
    :deep(.custom-indicator-class) {
      bottom: -$rpx-16;
    }
    :deep(.custom-item-class) {
      margin-right: $rpx-8;
      border-radius: $rpx-16;
    }
  }
  // Grid宫格
  .custom-class-grid {
    padding: $rpx-16 0;
    :deep(.custom-class-item) {
      padding: $rpx-16 $rpx-10 0 0;

      .wd-grid-item__content {
        padding: 0;
      }
      .grid-item-img {
        width: $rpx-55;
        height: $rpx-55;
      }

      .grid-item-text {
        @extend %font-size-base;
        color: $color-secondary;
        text-align: center;
      }
    }
  }

  // 待办事项
  .schedule {
    @extend %flex-column;
    gap: $rpx-16;
    align-items: flex-start;
    margin-top: $rpx-16;

    .font-color-timeout {
      color: $color-svg-timeout;
    }

    .font-color-current {
      color: $color-primary;
    }

    .font-color-wait {
      color: $color-svg-wait;
    }

    .schedule-title {
      @extend %font-size-xl;
      line-height: $rpx-24;
      color: $color-title;
    }

    .schedule-item {
      @extend %flex-column;
      gap: $rpx-12;

      width: 100%;
      padding: $rpx-12;

      background: $color-white;
      border: $rpx-1 solid $color-border;
      border-radius: $rpx-2;

      .item-header {
        @extend %flex-between;
        height: $rpx-50;
        .item-svg {
          width: $rpx-45;
          height: $rpx-45;
        }
        .item-header-right {
          @extend %flex-column;
          gap: $rpx-4;
          align-items: flex-end;

          width: 50%;
          height: $rpx-50;

          .item-time {
            height: $rpx-24;
            @extend %font-size-xl;
            line-height: $rpx-24;
            color: $color-text-blue;
          }

          .item-status {
            height: $rpx-22;
            @extend %font-size-base;
            line-height: $rpx-22;
          }
        }
      }

      .item-divider {
        position: relative;
        width: 100%;
        height: $rpx-1-5;
      }

      .item-content {
        @extend %flex-column;
        gap: $rpx-4;
        align-items: flex-start;
        @extend %font-size-base;
      }
    }
  }
}
</style>
