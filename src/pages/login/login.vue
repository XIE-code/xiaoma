<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>

<template>
  <view class="wrapper">
    <image :src="loginTop" class="login-bg-top" mode="scaleToFill" />
    <image :src="loginMedium" class="login-bg-medium" mode="scaleToFill" />
    <image :src="loginBottom" class="login-bg-bottom" mode="scaleToFill" />

    <image class="login-logo" src="@/static/image/login-logo.png" mode="scaleToFill" />
    <view class="container">
      <!-- logo -->
      <!-- 账号 -->
      <view class="login-input-group">
        <view class="input-label">账号</view>
        <input
          class="login-input"
          placeholder="请输入账号"
          type="text"
          v-model="loginForm.account"
        />
      </view>
      <!-- 密码 -->
      <view class="login-input-group">
        <view class="input-label">密码</view>
        <!-- type="safe-password" -->
        <input
          class="login-input"
          type="text"
          password
          placeholder-class="uni-input-placeholder"
          placeholder-style="color:#red "
          placeholder="请输入密码"
          v-model="loginForm.password"
        />
      </view>
      <view class="forgot">Forgot Password?</view>
    </view>
    <button class="login-btn" @click="handleLoginBtn">登录</button>
    <!-- <weconsole></weconsole> -->
  </view>
</template>

<script lang="ts" setup>
// svg
import loginTop from '@/static/image/login-top.png'
import loginMedium from '@/static/image/login-medium.png'
import loginBottom from '@/static/image/login-bottom.png'
import { useUserStore } from '@/store'
import { postLogin } from '@/service/login'
import { md5 } from '@/utils/md5'
// import 'weconsole/dist/npm/main/init'

onShow(() => {
  console.log('addElevator :>> ')
})

// 登录框
const loginForm = reactive({
  account: 'test',
  password: '123456',
})

/* userStore */
const userStore = useUserStore()
const handleLoginBtn = () => {
  console.log('login pwd', loginForm.password)
  // TODO: 登录
  postLogin({
    name: loginForm.account,
    password: md5(loginForm.password),
  })
    .then((res) => {
      userStore.setUserInfo({
        ...res.data,
        token: res.data.token,
      })
      uni.switchTab({ url: '/pages/index/index' })
    })
    .catch((err) => {
      console.log('err :>> ', err)
    })
}
</script>

<style lang="scss" scoped>
$rpx-17: px2rpx(17);
$rpx-19: px2rpx(19);
$rpx-21: px2rpx(21);
$rpx-33: px2rpx(33);

$rpx-120: px2rpx(120);
$rpx-144: px2rpx(144);
$rpx-250: px2rpx(250);
$rpx-380: px2rpx(380);
$rpx-563: px2rpx(563);
$rpx-550: px2rpx(550);
$rpx-438: px2rpx(438);
$rpx-634: px2rpx(634);
$rpx-251: px2rpx(251);
$rpx-457: px2rpx(457);
$rpx-118: px2rpx(118);
$rpx-140: px2rpx(140);
$rpx-250: px2rpx(250);
$rpx-220: px2rpx(220);

$rpx-100: px2rpx(100);
$rpx-130: px2rpx(130);
$rpx-140: px2rpx(140);
$rpx-150: px2rpx(150);
$rpx-160: px2rpx(160);
// wrapper
.wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  // background-image: url('../../static/image/login-bg.png');
  // background-repeat: no-repeat;
  // background-position: center;
  // background-size: 200% 200%;
  overflow: hidden;

  .login-bg-top {
    position: absolute;
    top: -$rpx-120;
    left: -$rpx-140;
    width: $rpx-563;
    height: $rpx-380;
  }

  .login-bg-medium {
    position: absolute;
    // top: $rpx-50;
    top: 0;
    left: -$rpx-80;
    z-index: -1;
    width: $rpx-634;
    height: $rpx-438;
  }

  .login-bg-bottom {
    position: absolute;
    bottom: -$rpx-220;
    left: -$rpx-100;

    width: $rpx-563;
    height: $rpx-380;
  }

  .login-logo {
    position: absolute;
    top: 50%;
    left: $rpx-21;
    width: $rpx-250;
    height: $rpx-120;
    transform: translateY(-50%);
  }

  $rpx-310: px2rpx(310);
  .container {
    position: absolute;
    top: calc(50% + $rpx-120);
    left: $rpx-25;
    gap: $rpx-18;
    justify-content: flex-start;

    width: $rpx-310;
    transform: translateY(calc(-50% + $rpx-60 - $rpx-18));
    @extend %flex-column;

    %input-label-font {
      font-family: Nunito;
      font-size: $rpx-14;
      font-weight: 400;
      line-height: $rpx-19;

      color: rgb(255, 176, 23);
      text-align: left;
      letter-spacing: 0;
    }

    .login-input-group {
      // width: $rpx;
      // margin-top: $rpx-40;

      .input-label {
        height: $rpx-20;
        @extend %input-label-font;
      }

      .login-input,
      .uni-input-input {
        height: $rpx-40;
        padding-left: $rpx-4;
        margin-top: $rpx-2;
        color: rgba(255, 176, 23, 0.69);

        background: rgba(47, 128, 237, 0);

        border: $rpx-1 solid rgb(255, 176, 23);
        border-radius: $rpx-10;
        @extend %input-label-font;
      }
      .uni-input-placeholder {
        color: rgba(255, 176, 23, 0.69);
      }
    }
    .forgot {
      font-weight: 700;
      text-align: right;
      // background: red;
      @extend %input-label-font;
    }
  }
  .login-btn {
    @extend %btn-reset;
    @extend %flex-center;
    position: absolute;
    right: $rpx-30;
    bottom: $rpx-30;
    width: $rpx-144;
    height: $rpx-60;
    padding-left: 0.5rem;
    font-family: Nunito; //TODO: 字体
    font-size: $rpx-24;
    font-weight: 400;
    line-height: $rpx-33;

    color: rgb(255, 255, 255);
    text-align: center;
    letter-spacing: 0.5rem;
    background: rgba(47, 128, 237, 0.8);
    border: $rpx-1 solid rgb(255, 255, 255);
    border-radius: $rpx-7;

    box-shadow: 0px $rpx-4 $rpx-4 0px rgba(0, 0, 0, 0.25);
  }
}
</style>
