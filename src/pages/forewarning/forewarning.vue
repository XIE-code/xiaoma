<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '急修列表',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="header">
      <view class="header-nav">
        <view class="title">急修列表</view>
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
        <wd-table border :data="forewarningList" height="100%" customClass="custom-maintenance">
          <wd-table-col align="center" width="20%" prop="faultSyn" label="故障描述"></wd-table-col>
          <wd-table-col align="center" width="20%" prop="faultCode" label="故障代码"></wd-table-col>
          <wd-table-col align="center" width="20%" prop="eleName" label="所属电梯"></wd-table-col>
          <wd-table-col
            align="center"
            width="20%"
            prop="faultStartTime"
            label="故障时间"
          ></wd-table-col>
          <wd-table-col
            align="center"
            width="20%"
            prop="repairType"
            label="工单状态"
          ></wd-table-col>
        </wd-table>
      </view>
    </view>
  </wrapper>
  <xm-tabbar></xm-tabbar>
</template>

<script lang="ts" setup>
/* components */
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'
import { http } from '@/utils/http'
import wrapper from '@/layouts/wrapper.vue'
/* store */
import { useSystemStore } from '@/store'
/* service */
import { ILiftListResponse } from '@/pages-sub/service/lift/type'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
import { liftListPage } from '@/common/pages'

const systemStore = useSystemStore()
const { capsule } = systemStore.systemInfo

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
const forewarningList = ref<ILiftListResponse[]>([])

/* 点击电梯信息、跳转电梯详情页 */
const handleClickItem = (item: ILiftListResponse) => {
  console.log('addElevator :>> click item', item)
  uni.navigateTo({ url: `${liftListPage}?elevatorId=${item.elevatorId}` })
}

onLoad(() => {
  uni.hideTabBar()
})

onShow(() => {
  http.post('/maint/fault_order', { page: 1, limit: 999 }).then((res) => {
    console.log('fault_order res :>> ', res)
    res.list.forEach((element) => {
      const stateList = [
        '待审核',
        '待接警',
        '待处理',
        '到达现场处理中',
        '维修完成',
        '误报确认',
        '自动修复',
      ]
      element.repairType = stateList[element.repairType]
    })
    forewarningList.value = res.list
  })
})
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
    // @extend %padding-base;
  }
}
</style>
