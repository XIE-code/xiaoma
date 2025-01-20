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
        @click="handleClickLeft"
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
import { postBreakdownCode, postLiftGetRun } from '@/service/elevator'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
// 导航栏
function handleClickLeft() {
  uni.navigateBack()
}

// 内容区域
interface IDetailItem {
  key: string // key
  label: string // 标题
  value: string // 文字
}

/* 电梯基本信息 */
const liftBaseInfo = ref<IDetailItem[]>([
  {
    key: 'elevatorName',
    label: '电梯名称',
    value: '园洲花园8栋16号(测试)',
  },
  {
    key: 'elevatorNumber',
    label: '电梯编号',
    value: '230101114',
  },
  {
    key: 'elevatorType',
    label: '电梯类型',
    value: '',
  },
  {
    key: 'elevatorAddress',
    label: '所在小区',
    value: '一号楼',
  },
  {
    key: 'elevatorAddressDetail',
    label: '详细地址',
    value: '',
  },
])
/* 标签页信息 */
/* 当前选项卡索引 */
const tabIdx = ref<number>(0)
/* 标签页信息 */
type tabsItemType = {
  title: string
  data: tabsDataItemType[] // TODO: 更换类型
}
/* 标签内容 */
type tabsDataItemType = {
  label: string
  value: string
}

const leaveFactory = ref<tabsDataItemType[]>([
  {
    label: '电梯制作商',
    value: '0',
  },
  {
    label: '生产日期',
    value: '',
  },
  {
    label: '电梯品牌',
    value: '',
  },
  {
    label: '电梯品种',
    value: '电梯类型',
  },
  {
    label: '电梯型号',
    value: '',
  },
  {
    label: '改造单位',
    value: '',
  },
  {
    label: '改造型号',
    value: '',
  },
])

const maintenance = ref<tabsDataItemType[]>([
  {
    label: '维保单位',
    value: '广东佳登曼电梯',
  },
  {
    label: '维保人员1-电话',
    value: '维保人员1-电话',
  },
  {
    label: '维保人员2-电话',
    value: '维保人员2-电话',
  },
  {
    label: '维保状态',
    value: '',
  },
  {
    label: '登记机关',
    value: '',
  },
  {
    label: '维保开始时间',
    value: '',
  },
  {
    label: '检验机构',
    value: '',
  },
  {
    label: '本次限速器效验时间',
    value: '',
  },
  {
    label: '本次制动试验时间',
    value: '',
  },
])

const faultCode = ref<tabsDataItemType[]>([])

const tabsInfo = computed(() => {
  return [
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
  ]
})

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

/* TODO: 获取故障信息 路由携带devices_id */
const getBreakdownInfo = () => {
  postBreakdownCode({ devices_id: '0' }).then((res) => {
    faultCode.value = res.map((item: any) => {
      return {
        label: item.fault,
        value: item.solve,
      }
    })
    console.log('faultCode.value :>> ', faultCode.value)
  })
}
const handleTabsClick = (tab: { index: number; title: number }) => {
  console.log('tabIdx.value :>> ', tabIdx.value)
  // TODO: tabIdx ===2
  if (tab.index === 2) {
    getBreakdownInfo()
  }
}
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
