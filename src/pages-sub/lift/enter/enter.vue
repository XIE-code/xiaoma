<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '电梯信息录入',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="navigation" :style="{ height: px2rpx(capsule.height || 32) }">
      <wd-icon
        name="arrow-left"
        @click="handleClickBack"
        :size="px2rpx(24)"
        color="white"
      ></wd-icon>
      <view class="title">电梯信息录入</view>
    </view>
    <!-- Form -->
    <view class="content">
      <view class="scroll-box">
        <view class="container" v-for="(item, index) in contentTopList" :key="index">
          <view class="input-label position-left">
            {{ item.label }}
          </view>
          <view class="input-container">
            <input
              class="uni-input-input"
              type="text"
              placeholder-style="color: rgba(255, 176, 23, 0.69)"
              :placeholder="`请输入${item.placeholder}`"
              v-model="item.value"
              @input="item.value = item.value.replace(/^\s*/g, '')"
            />
          </view>
        </view>
        <view class="container medium-container">
          <view class="cell-container" v-for="(item, index) in contentMediumList" :key="index">
            <view class="input-label position-center">
              {{ item.label }}
            </view>
            <view class="cell-input-container">
              <input
                class="uni-input-input"
                type="number"
                style="text-align: center"
                v-model="item.value"
                @input="item.value = item.value.replace(/\./g, '')"
              />
            </view>
          </view>
        </view>
        <view class="container" v-for="(item, index) in contentDownList" :key="index">
          <view class="input-label position-left">
            {{ item.label }}
          </view>
          <view class="input-container">
            <input
              class="uni-input-input"
              type="text"
              placeholder-style="color: rgba(255, 176, 23, 0.69)"
              :placeholder="`请输入${item.placeholder}`"
              v-model="item.value"
              @input="item.value = item.value.replace(/^\s*/g, '')"
            />
          </view>
        </view>
        <button class="submit-btn" @click="handleClickAddLift">
          <text>提交</text>
        </button>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* 第三方库 */
import { useToast } from 'wot-design-uni'
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* store */
import { useSystemStore } from '@/store/system'
/* service */
import { postLiftLiftAdd } from '@/pages-sub/service/lift/lift'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'

const systemStore = useSystemStore()
const { capsule } = systemStore.systemInfo

// 导航栏
function handleClickBack() {
  uni.navigateBack()
}

// 内容区域
interface IInputItem {
  name: string
  label: string
  placeholder: string
  value: string
}

/* TODO: 使用Form重构界面 */
const initTopListData: IInputItem[] = [
  {
    name: 'name',
    label: '电梯名称',
    placeholder: '电梯名称',
    value: '',
  },
  {
    name: 'registerCode',
    label: '出厂编码',
    placeholder: '出厂编码',
    value: '',
  },
  {
    name: 'deviceId',
    label: '设备代码',
    placeholder: '设备代码',
    value: '',
  },
]

const initMediumListData: Omit<IInputItem, 'placeholder'>[] = [
  {
    name: 'floor',
    label: '层',
    value: '',
  },
  {
    name: 'station',
    label: '站',
    value: '',
  },
  {
    name: 'door',
    label: '门',
    value: '',
  },
]

const initDownListData: IInputItem[] = [
  {
    name: 'speed',
    label: '速度',
    placeholder: '电梯速度',
    value: '',
  },
  {
    name: 'load',
    label: '载重',
    placeholder: '电梯载重',
    value: '',
  },
]

const contentTopList = reactive<IInputItem[]>(initTopListData)

const contentMediumList = reactive<Omit<IInputItem, 'placeholder'>[]>(initMediumListData)

const contentDownList = reactive<IInputItem[]>(initDownListData)

/* 遍历数组，将数组内的对象的value置空 */
const resetInputList = (list: Array<IInputItem | Omit<IInputItem, 'placeholder'>>) => {
  list.forEach((item) => {
    item.value = ''
  })
}

const toast = useToast()

/* 添加电梯 */
const handleClickAddLift = () => {
  if (contentTopList[0].value === '') return toast.show('请输入电梯名称')
  postLiftLiftAdd({
    name: contentTopList[0].value,
    register_code: contentTopList[1].value,
    devices_id: contentTopList[2].value,
    floor: contentMediumList[0].value,
    station: parseInt(contentMediumList[1].value),
    door: parseInt(contentMediumList[2].value),
    load: contentDownList[0].value,
    speed: contentDownList[1].value,
  })
    .then((res) => {
      resetInputList(contentTopList)
      resetInputList(contentMediumList)
      resetInputList(contentDownList)
      toast.show('添加成功')
    })
    .catch((err) => {
      console.log('err :>> ', err)
    })
}
</script>

<style lang="scss" scoped>
$rpx-17: px2rpx(17);
$rpx-26: px2rpx(26);
$rpx-44: px2rpx(44);

$rpx-53: px2rpx(53);
$rpx-76: px2rpx(76);
$rpx-167: px2rpx(167);

%input-label-font {
  @extend %font-size-lg;
  line-height: $rpx-26;
  color: $color-secondary-69;
}
// 导航栏
.navigation {
  @extend %flex-center;
  flex-shrink: 0;
  gap: $rpx-16;
  justify-content: flex-start;
  padding: 0 $rpx-24;
  background: $color-secondary;

  .title {
    @extend %font-size-xl;
    @extend %flex-center;
    height: $rpx-28;
    color: $color-white;
  }
}
// 内容
.content {
  flex-grow: 1;
  margin-top: $rpx-10;
  overflow: scroll;
  background: $color-white;
  border-radius: $rpx-30 $rpx-30 0 0;

  .scroll-box {
    @extend %flex-column;
    gap: $rpx-24;
    padding: $rpx-16 $rpx-24;

    .container {
      position: relative;
      width: 100%;
      height: $rpx-76;
      padding-top: $rpx-16;

      .input-label {
        @extend %input-label-font;
        padding: 0 $rpx-6;
        color: $color-secondary;
        background-color: $color-white;
      }
      .position-left {
        position: absolute;
        top: $rpx-3;
        left: $rpx-25;
      }

      .input-container {
        @extend %flex-center;
        @extend %input-label-font;
        @extend %border;
        justify-content: flex-start;
        width: 100%;
        height: $rpx-60;
        padding: $rpx-18 $rpx-44;
        color: $color-secondary-69;

        .uni-input-input {
          height: $rpx-25;
        }
      }
    }

    .medium-container {
      @extend %flex-between;
      gap: $rpx-40;
      padding-top: 0;
      overflow: hidden;
      // 层、门、站
      .cell-container {
        @extend %input-label-font;
        position: relative;
        width: calc((100% - $rpx-80) / 3);
        height: inherit;
        padding-top: $rpx-16;

        .input-label {
          @extend %input-label-font;
          padding: 0 $rpx-6;

          color: $color-secondary;
          background-color: $color-white;
        }
        .position-center {
          position: absolute;
          top: $rpx-3;
          left: 50%;
          transform: translateX(-50%);
        }
        // input
        .cell-input-container {
          @extend %flex-center;
          @extend %input-label-font;
          @extend %border;
          width: 100%;
          height: $rpx-60;

          .uni-input-input {
            @extend %input-label-font;
            height: $rpx-25;
            color: $color-secondary-69;
          }
        }
      }
    }

    .submit-btn {
      @extend %btn-reset;
      @extend %font-size-lg;
      @extend %flex-center;
      flex-shrink: 0;
      width: $rpx-167;
      height: $rpx-53;
      margin: $rpx-25 auto 0;

      font-size: $rpx-17;
      line-height: $rpx-24;

      color: $color-white;
      letter-spacing: $rpx-1;

      background: $color-secondary;

      border-radius: $rpx-16;
    }
  }
}
</style>
