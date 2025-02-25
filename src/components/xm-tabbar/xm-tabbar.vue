<template>
  <view class="tab-bar">
    <view
      v-for="item in tabBars"
      :key="item.idx"
      :class="['item', item.idx === tabBarIdx ? 'currentItem' : '']"
      @tap="handleChangeItem(item)"
    >
      <image :src="item.idx === tabBarIdx ? item.selectSvg : item.svg" class="item-svg"></image>
      <view v-if="item.idx === tabBarIdx">{{ item.text }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/store/system'
import homeSvg from '@/static/svg/home.svg'
import homeSelectSvg from '@/static/svg/home-select.svg'
import maintenanceSvg from '@/static/svg/maintenance.svg'
import maintenanceSelectSvg from '@/static/svg/maintenance-select.svg'
import urgentRepairSvg from '@/static/svg/urgent-repair.svg'
import urgentRepairSelectSvg from '@/static/svg/urgent-repair-select.svg'
import personSvg from '@/static/svg/person.svg'
import personSelectSvg from '@/static/svg/person-select.svg'
import { indexPage, maintenancePage, personalPage, urgentRepairPage } from '@/common/pages'

const systemStore = useSystemStore()
const systemInfo = systemStore.systemInfo

const tabBarIdx = ref(systemStore.getTabBarIdx())

const tabBars = [
  // 示例数据
  { idx: 0, svg: homeSvg, selectSvg: homeSelectSvg, path: indexPage, text: '首页' },
  {
    idx: 1,
    svg: maintenanceSvg,
    selectSvg: maintenanceSelectSvg,
    path: maintenancePage,
    text: '保养',
  },
  {
    idx: 2,
    svg: urgentRepairSvg,
    selectSvg: urgentRepairSelectSvg,
    path: urgentRepairPage,
    text: '急修',
  },

  {
    idx: 3,
    svg: personSvg,
    selectSvg: personSelectSvg,
    path: personalPage,
    text: '个人',
  },
]

// 定义方法
const handleChangeItem = (item: { path: string; idx?: number }) => {
  systemStore.setTabBarIdx(item.idx)
  uni.switchTab({
    url: item.path,
  })
}
</script>

<style scoped lang="scss">
$rpx-42: px2rpx(42);
$rpx-105: px2rpx(105);

.tab-bar {
  position: fixed;
  bottom: 0;
  gap: $rpx-16;
  justify-content: space-around;
  width: 100%;
  height: $rpx-90;
  padding: $rpx-16 $rpx-24;
  background: white;
  @extend %flex-center;

  .item {
    width: $rpx-60;
    height: $rpx-60;
    padding: $rpx-16;

    .item-svg {
      width: $rpx-24;
      height: $rpx-24;
    }
    .item-text {
      font-size: $rpx-14;
      color: #666;
    }
  }
  .currentItem {
    @extend %flex-center;
    gap: $rpx-8;
    width: $rpx-105;
    height: $rpx-42;
    padding: $rpx-9 $rpx-16;
    color: rgb(83, 157, 243);
    background: rgba(83, 157, 243, 0.37);
    border-radius: $rpx-16;
  }
}
</style>
