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
      <image class="logo" :src="imageStatic.homeLogo" mode="aspectFit"></image>
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
      <image :src="svgStatic.notification" mode="aspectFit" class="notification-icon" />
    </view>
    <!-- 滚动效果 -->
    <view class="scroll-box">
      <!-- 通知栏 -->
      <view class="notification">
        <view class="notification-container">
          <view class="fix-elevator-number">
            <text class="text">今日维保电梯数量</text>
            <text class="number">{{ count }}</text>
          </view>
          <view class="separator"></view>
          <view class="breakdown-elevator-number">
            <text class="text">故障电梯数量</text>
            <text class="number">{{ faultCount }}</text>
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
          @click="handleSwiperItemClick"
          :previousMargin="px2rpx(30)"
          :nextMargin="px2rpx(60)"
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
        <view
          class="schedule-item"
          @click="handleSignIn(item)"
          :key="item.id"
          v-for="item in todoList"
        >
          <view class="item-elevator-name">电梯名称：{{ item.eleName }}</view>
          <view class="item-elevator-name">保养类型：{{ item.maintType }}</view>
          <view class="item-elevator-name">
            <text>保养状态：</text>
            <text :class="[getItemInfoByMaintenanceType('color', item.isMaintain)]">
              {{ getItemInfoByMaintenanceType('text', item.isMaintain) }}
            </text>
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
import dayjs from 'dayjs'
/* tools */
import { px2rpx } from '@/utils/tools'
/* svg,image */
import { svgStatic, imageStatic } from '@/common/static'
/* api */
import { postMaintenanceList } from '@/service/maintenance/maintenance'
import type { IMaintenanceItem, isMaintainType } from '@/service/maintenance/type'
import {
  knowledgeCompanyPage,
  liftEnterPage,
  liftListPage,
  shopPage,
  signInPage,
} from '@/common/pages'

defineOptions({
  name: 'Home',
})

function handleSearch() {
  console.log('触发搜索事件 :>> ')
}

//  轮播图
const current = ref(0)
const swiperList = reactive([
  imageStatic.lifeCycleSwiper,
  imageStatic.liftSwiper,
  imageStatic.lifeCycleSwiper,
  imageStatic.liftSwiper,
])

const handleSwiperItemClick = (params) => {
  let urlParams = ''
  if (params.item === imageStatic.lifeCycleSwiper) {
    urlParams = '/index/index'
  } else if (params.item === imageStatic.liftSwiper) {
    urlParams = '/columnGoods/goods_list/index?id=39&title=整梯销售'
  }

  uni.navigateTo({ url: `${shopPage}?urlParams=${urlParams}` })
}

// 电梯添加、档案资料、电梯监控
const elevatorList = reactive([
  {
    id: 1,
    name: '电梯监控',
    url: svgStatic.monitor,
    path: liftListPage + '?flag=monitor',
  },
  {
    id: 2,
    name: '档案资料',
    url: svgStatic.files,
    path: liftListPage + '?flag=file',
  },
  {
    id: 3,
    name: '电梯知识库',
    url: svgStatic.knowledge,
    path: knowledgeCompanyPage,
  },
  {
    id: 4,
    name: '添加电梯',
    url: svgStatic.addElevator,
    path: liftEnterPage,
  },
])

const count = ref(0)
const faultCount = ref(0)
const todoList = ref<IMaintenanceItem[]>([])

/* TODO: 下拉加载 */
const getMaintenanceList = () => {
  // 获取维保列表
  postMaintenanceList({
    time: dayjs().format('YYYY-MM-DD'),
    limit: 99,
    page: 1,
  })
    .then((result) => {
      todoList.value = result.list
      count.value = result.count
    })
    .catch((err) => {
      console.log('postMaintenanceList err :>> ', err)
    })
}

/* maintenanceType */
type itemType = 'color' | 'text'
// 维保状态 1：待维保， 2：已维保 ：3：进行中：4：逾期签到
const maintenanceTypeArray = ['待维保', '已维保', '进行中', '逾期签到']
const maintenanceColorArray = ['wait', 'finish', 'current', 'timeout']

/* 根据item的svg状态返回svg、颜色、文字 */
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

onLoad(() => {
  uni.hideTabBar()
})

onShow(() => {
  getMaintenanceList()
})
</script>

<style lang="scss" scoped>
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

    .schedule-title {
      @extend %font-size-xl;
      line-height: $rpx-24;
      color: $color-title;
    }

    .schedule-item {
      @extend %flex-column;
      gap: $rpx-4;
      align-items: flex-start;
      width: 100%;
      padding: $rpx-12;
      @extend %font-size-base;
      font-weight: 600;
      background: $color-white;
      border: $rpx-1 solid $color-border;
      border-radius: $rpx-2;

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
    }
  }
}
</style>
