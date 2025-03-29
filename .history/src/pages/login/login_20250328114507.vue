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
    <image :src="imageStatic.loginTop" class="login-bg-top" mode="scaleToFill" />
    <image :src="imageStatic.loginMedium" class="login-bg-medium" mode="scaleToFill" />
    <image :src="imageStatic.loginBottom" class="login-bg-bottom" mode="scaleToFill" />

    <image class="login-logo" :src="imageStatic.loginLogo" mode="scaleToFill" />
    <form>
      <view class="container">
        <view class="login-input-group">
          <view class="login-input-label">账号</view>
          <input
            class="login-input-value"
            placeholder="请输入账号"
            type="text"
            name="account"
            placeholder-style="color: rgba(255, 176, 23, 0.69)"
            v-model="loginForm.account"
          />
        </view>
        <!-- 密码 -->
        <view class="login-input-group">
          <view class="login-input-label">密码</view>
          <input
            name="password"
            class="login-input-value"
            type="text"
            @keydown.enter="handleLoginBtn"
            password
            placeholder-style="color: rgba(255, 176, 23, 0.69)"
            placeholder="请输入密码"
            v-model="loginForm.password"
          />
        </view>
        <view class="forgot">Forgot Password?</view>
      </view>
      <button form-type="submit" class="login-btn" @click="handleLoginBtn">登录</button>
    </form>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore, useSystemStore } from '@/store'
import { postLogin } from '@/service/login/login'
import { md5 } from '@/utils/md5'
import { indexPage, loginPage } from '@/common/pages'
/* static */
import { imageStatic } from '@/common/static'

// 登录框
const loginForm = reactive({
  account: '',
  password: '',
})

/* userStore\systemStore */
const userStore = useUserStore()
const systemStore = useSystemStore()

const handleLoginBtn = () => {
  if (!loginForm.account || !loginForm.password) {
    const emptyFields = []
    !loginForm.account && emptyFields.push('账号')
    !loginForm.password && emptyFields.push('密码')

    uni.showToast({ title: `请输入${emptyFields.join('和')}`, icon: 'none' })
    return
  }

  postLogin({
    name: loginForm.account,
    password: md5(loginForm.password),
  })
    .then((res) => {
      userStore.setUserInfo({ ...res })
      systemStore.setTabBarIdx(0)
      uni.navigateTo({ url: indexPage })
    })
    .catch((err) => {
      uni.showToast({
        icon: 'none',
        title: '输入的账号或密码有误',
      })
      console.log('postLogin err :>> ', err)
    })
}

// 检查登录状态
const checkLoginStatus = () => {
  // 从 localStorage 获取 token
  const token = userStore.getToken()
  if (token) {
    uni.switchTab({ url: indexPage })
  } else {
    uni.switchTab({ url: loginPage })
  }
}

// 页面加载时检查登录状态
onLoad(() => {
  checkLoginStatus()
})
</script>

<style lang="scss" scoped>
$rpx-17: px2rpx(17);
$rpx-19: px2rpx(19);
$rpx-21: px2rpx(21);
$rpx-33: px2rpx(33);
/* svg背景宽高 */
$rpx-380: px2rpx(380);
$rpx-563: px2rpx(563);

$rpx-120: px2rpx(120);
$rpx-144: px2rpx(144);
$rpx-250: px2rpx(250);

// wrapper
.wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  $rpx-140: px2rpx(140);

  .login-bg-top {
    position: absolute;
    top: -$rpx-120;
    left: -$rpx-140;
    width: $rpx-563;
    height: $rpx-380;
  }

  $rpx-438: px2rpx(438);
  $rpx-634: px2rpx(634);

  .login-bg-medium {
    position: absolute;
    top: 0;
    left: -$rpx-80;
    z-index: -1;
    width: $rpx-634;
    height: $rpx-438;
  }

  $rpx-220: px2rpx(220);
  $rpx-100: px2rpx(100);

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

  .container {
    position: absolute;
    top: calc(50% + $rpx-120);
    left: $rpx-25;
    @extend %flex-column;
    gap: $rpx-18;
    justify-content: flex-start;

    width: $rpx-250;
    transform: translateY(calc(-50% + $rpx-60 - $rpx-18));

    .login-input-group {
      @extend %flex-column;
      gap: $rpx-6;
      .login-input-label {
        height: $rpx-20;
        @extend %font-size-base;
        color: $color-secondary-69;
      }

      .login-input-value {
        height: $rpx-40;
        padding-left: 0.5rem;

        @extend %font-size-base;
        color: $color-secondary;

        border: $rpx-1 solid $color-secondary;
        border-radius: $rpx-10;
      }
    }

    .forgot {
      @extend %font-size-base;
      font-weight: 700;
      color: $color-secondary;
      text-align: right;
    }
  }

  .login-btn {
    @extend %btn-reset;
    position: absolute;
    right: $rpx-30;
    bottom: $rpx-30;

    @extend %flex-center;
    width: $rpx-144;
    height: $rpx-60;
    padding-left: 0.5rem;

    @extend %font-size-xl;
    font-size: $rpx-24;
    color: $color-white;
    text-align: center;
    letter-spacing: 0.5rem;

    background: rgba(47, 128, 237, 0.8);
    border: $rpx-1 solid $color-white;
    border-radius: $rpx-7;
    box-shadow: 0px $rpx-4 $rpx-4 0px $color-black-05;
  }
}
</style>
