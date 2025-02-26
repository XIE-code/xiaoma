<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '电梯详情',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="navigation">
      <wd-icon
        name="arrow-left"
        @click="handleClickBack"
        :size="px2rpx(24)"
        color="white"
      ></wd-icon>
      <view class="title">电梯详细信息</view>
    </view>

    <view class="content">
      <view class="scroll-box">
        <wd-cell
          :title="item.label"
          :value="item.value"
          :key="idx"
          class="base-info--text"
          v-for="(item, idx) in liftBaseInfo"
        />
        <wd-tabs custom-class="tabs-info" @click="handleTabsClick" v-model="tabIdx">
          <block v-for="(item, idx) in tabsInfo" :key="idx">
            <wd-tab :title="item.title">
              <view class="tab-content">
                <wd-cell
                  :title="tabsItem.label"
                  :value="tabsItem.value"
                  :key="idx"
                  class="base-info--text"
                  v-for="(tabsItem, idx) in item.data"
                />
              </view>
            </wd-tab>
          </block>
        </wd-tabs>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* TODO: scrollBox */
import scrollBox from '@/layouts/scroll-box.vue'
/* service */
import { postBreakdownCode, postLiftGetRun } from '@/service/lift/lift'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
import {
  IDetailItem,
  leaveFactoryData,
  liftBaseInfoData,
  maintenanceData,
  tabsDataItemType,
} from './detail-data'
// 导航栏
function handleClickBack() {
  uni.navigateBack()
}

/* 电梯基本信息 */
const liftBaseInfo = ref<IDetailItem[]>(liftBaseInfoData)
/* 标签页信息 */
/* 当前选项卡索引 */
const tabIdx = ref<number>(0)

const leaveFactory = ref<tabsDataItemType[]>(leaveFactoryData)

const maintenance = ref<tabsDataItemType[]>(maintenanceData)

const faultCode = ref<tabsDataItemType[]>([])

const tabsInfo = reactive([
  {
    title: '出厂',
    data: leaveFactory.value,
  },
  {
    title: '维保',
    data: maintenance.value,
  },
  {
    title: '故障',
    data: faultCode.value,
  },
])

const getBreakdownInfo = () => {
  postBreakdownCode({ devices_id: '0' }).then((res) => {
    faultCode.value = res.map((item: any) => {
      return {
        label: item.fault,
        value: item.solve,
      }
    })
  })
}

const handleTabsClick = (tab: { index: number; title: number }) => {
  if (tab.index === 2) {
    getBreakdownInfo()
  }
}

onLoad((options) => {
  const elevatorId = options.elevatorId
  postLiftGetRun({ code: elevatorId })
    .then((result) => {
      const resultKeys = Object.keys(result)
      for (const item of liftBaseInfo.value) {
        item.value = resultKeys.includes(item.key) ? result[item.key] : item.value
      }
    })
    .catch((err) => {
      console.log('postLiftGetRun err:>> ', err)
    })
})
</script>

<style lang="scss" scoped>
$rpx-17: px2rpx(17);

%font-size-12 {
  @extend %font-size-xs;
  color: $color-black;
}

// 导航栏
.navigation {
  @extend %flex-center;
  flex-shrink: 0;
  gap: $rpx-16;
  justify-content: flex-start;
  height: $rpx-32;
  padding: 0 $rpx-24;
  background: $color-secondary;

  .title {
    @extend %font-size-xl;
    @extend %flex-center;
    line-height: $rpx-28;
    color: $color-white;
  }
}
// 内容
.content {
  flex-grow: 1;
  margin-top: $rpx-10;
  overflow: scroll;
  background: #f8f9fa;
  border-radius: $rpx-30;
  .scroll-box {
    @extend %flex-column;
    gap: $rpx-24;
    padding-top: $rpx-30;

    .base-info--text {
      :deep(.wd-cell__title, .wd-cell__value) {
        @extend %font-size-12;
      }
    }

    :deep(.tabs-info) {
      .is-active {
        .wd-tabs__nav-item-text {
          font-weight: 400;
          color: $color-primary;
        }
      }

      .wd-tabs__line {
        background-color: $color-primary;
      }
    }
  }
}
</style>
