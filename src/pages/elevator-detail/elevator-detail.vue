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
      <view @click="handleClickLeft" class="nav-back">
        <image class="nav-back" :src="backSvg" mode="scaleToFill"></image>
      </view>
      <view class="title">详细信息</view>
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
        <wd-tabs class="tabs-info" v-model="tabIdx">
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
import { postBreakdownCode } from '@/service/elevator'
import backSvg from '@/static/svg/back.svg'
/* components */
import wrapper from '@/layouts/wrapper.vue'
import scrollBox from '@/layouts/scroll-box.vue'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
onShow(() => {
  console.log('addElevator :>> ')
})
// 导航栏
function handleClickLeft() {
  console.log('addElevator :>> /pages/elevator-list/elevator-list')

  // uni.navigateBack() // TODO: 是否会保留数据
  uni.navigateTo({ url: '/pages/elevator-list/elevator-list' })
}

// 内容区域
interface IDetailItem {
  label: string // 标题
  value: string // 文字
}

/* 电梯基本信息 */
const liftBaseInfo = reactive<IDetailItem[]>([
  {
    label: '电梯名称',
    value: '园洲花园8栋16号',
  },
  {
    label: '电梯编号',
    value: '230101114',
  },
  {
    label: '电梯类型',
    value: '',
  },
  {
    label: '所在小区',
    value: '一号楼',
  },
  {
    label: '详细地址',
    value: '',
  },
])
/* 标签页信息 */
/* 当前选项卡索引 */
const tabIdx = ref<number>(0)
/* 标签页信息 */
type tabsItem = {
  title: string
  data: any // TODO: 更换类型
}

const tabsInfo = reactive<tabsItem[]>([
  {
    title: '出厂',
    data: [
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
    ],
  },
  {
    title: '维保',
    data: [
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
    ],
  },
  {
    title: '故障',
    data: [
      {
        label: '故障日志1',
        value: 'time1',
      },
      {
        label: '故障日志2',
        value: 'time2',
      },
      {
        label: '故障日志3',
        value: 'time3',
      },
      {
        label: '故障日志4',
        value: 'time4',
      },
      {
        label: '故障日志5',
        value: 'time5',
      },
    ],
  },
])

/* TODO: 获取故障信息 路由携带devices_id */
const getBreakdownInfo = () => {
  postBreakdownCode({ devices_id: '0' }).then((res) => {
    // debugger
  })
}
</script>

<style lang="scss" scoped>
$rpx-17: px2rpx(17);

// 导航栏
.navigation {
  @extend %flex-center;
  flex-shrink: 0;
  gap: $rpx-16;
  justify-content: flex-start;
  height: $rpx-32;
  padding: 0 $rpx-24;
  background: $color-secondary;
  .nav-back {
    @extend %flex-center;
    width: $rpx-20;
    height: $rpx-20;
  }
  .title {
    @extend %font-size-extra-large;
    @extend %flex-center;
    font-family: Bebas Neue;
    line-height: $rpx-40;
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

    // padding: $rpx-16 $rpx-24;

    %font-size-12 {
      font-family: Lato;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.4;
      color: rgb(0, 0, 0);
      letter-spacing: 0px;
    }

    .base-info--text {
      :deep(.wd-cell__title, .wd-cell__value) {
        @extend %font-size-12;
      }
    }

    .tabs-info {
      background: $color-white;
      // @extend %font-size-12;
      :deep(.wd-tabs__item.is-active) {
        font-weight: 400;
        color: $color-primary;
      }
      :deep(.wd-tabs__line) {
        background-color: $color-primary;
      }
    }
  }
}
</style>
