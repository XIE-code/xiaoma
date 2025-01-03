<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '增加电梯',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="navigation">
      <view @click="handleClickLeft" class="nav-back">
        <image class="nav-back" :src="backSvg" mode="scaleToFill"></image>
      </view>
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
              :placeholder="`请输入${item.placeholder}`"
              v-model="item.value"
              @input="item.value = item.value.replace(/^\s*/g, '')"
            />
          </view>
        </view>
        <view class="container medium-container">
          <view class="cell-container" v-for="(item, index) in contentMediumList" :key="index">
            <!-- <view :class="['absolute', positionType == 'left' ? 'position-left' : 'position-center']"> -->
            <view class="input-label position-center">
              {{ item.label }}
            </view>
            <view class="cell-input-container">
              <input
                class="uni-input-input"
                type="text"
                style="text-align: center"
                v-model="item.value"
                @input="item.value = item.value.replace(/^\s*/g, '')"
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
              :placeholder="`请输入${item.placeholder}`"
              v-model="item.value"
              @input="item.value = item.value.replace(/^\s*/g, '')"
            />
          </view>
        </view>
        <button class="submit-btn">
          <text>提交</text>
        </button>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* svg */
import backSvg from '@/static/svg/back.svg'
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'

onShow(() => {
  console.log('addElevator :>> ')
})
// 导航栏
function handleClickLeft() {
  console.log('addElevator :>> click left')

  // uni.navigateBack() //TODO: 是否会保留数据
  uni.switchTab({ url: '/pages/index/index' })
}

// 内容区域
interface IInputItem {
  label: string
  placeholder: string
  value: string
}

const contentTopList = reactive<IInputItem[]>([
  {
    label: '电梯名称',
    placeholder: '电梯名称',
    value: '',
  },
  {
    label: '出厂编码',
    placeholder: '出厂编码',
    value: '',
  },
  {
    label: '设备代码',
    placeholder: '设备代码',
    value: '',
  },
])

const contentMediumList = reactive<Omit<IInputItem, 'placeholder'>[]>([
  {
    label: '层',
    value: '',
  },
  {
    label: '站',
    value: '',
  },
  {
    label: '门',
    value: '',
  },
])

const contentDownList = reactive<IInputItem[]>([
  {
    label: '速度',
    placeholder: '电梯速度',
    value: '',
  },
  {
    label: '载重',
    placeholder: '电梯载重',
    value: '',
  },
])
</script>

<style lang="scss" scoped>
$rpx-17: px2rpx(17);
$rpx-26: px2rpx(26);
$rpx-44: px2rpx(44);

$rpx-76: px2rpx(76);
$rpx-167: px2rpx(167);
$rpx-53: px2rpx(53);

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
    @extend %font-size-xl;
    @extend %flex-center;
    height: $rpx-32;
    font-family: Bebas Neue;
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

    %input-label-font {
      @extend %font-size-lg;
      line-height: $rpx-26;
      color: $color-secondary-69;
    }

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
      // input
      .input-container {
        @extend %flex-center;
        @extend %input-label-font;
        @extend %border;
        justify-content: flex-start;
        width: 100%;
        height: $rpx-60;
        padding: $rpx-18 $rpx-44;
        color: rgba(255, 176, 23, 0.69);

        .uni-input-input {
          height: $rpx-25;
        }
        .uni-input-placeholder {
          color: rgba(255, 176, 23, 0.69);
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

          color: rgb(255, 176, 23);
          background-color: white;
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

          .uni-input-input,
          .uni-input-placeholder {
            @extend %input-label-font;
            height: $rpx-25;
            color: rgba(255, 176, 23, 0.69);
          }
        }
      }
      // padding: $rpx-18 $rpx-4;
    }

    %border {
      border: $rpx-2 solid rgb(255, 176, 23);
      border-radius: $rpx-10;
    }
    /** 按钮 */
    .submit-btn {
      @extend %btn-reset;
      @extend %font-size-lg;
      @extend %flex-center;
      flex-shrink: 0;
      width: $rpx-167;
      height: $rpx-53;
      margin: $rpx-25 auto 0;

      font-family: 思源黑体;
      font-size: $rpx-17;
      line-height: $rpx-24;

      color: rgb(255, 255, 255);
      letter-spacing: $rpx-1;

      background: rgb(255, 176, 23);

      border-radius: $rpx-16;
    }
  }
}
</style>
