<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>
<template>
  <wrapper paddingType="top" :paddingBottom="90" :backgroundColor="COLOR_SECONDARY">
    <view class="header">
      <view class="avatar">
        <image class="avatar" :src="avatarImg" mode="scaleToFill"></image>
      </view>
      <view class="info">
        <span class="text">{{ userName }}</span>
        <span class="text">{{ phone }}</span>
        <span class="text">{{ companyName }}</span>
      </view>
    </view>
    <view class="content">
      <wd-cell
        clickable
        @click="handleClickRouteItem(item)"
        :title="item.label"
        :icon="item.icon"
        :key="idx"
        class="base-info--text"
        v-for="(item, idx) in routerList"
      />
      <button class="login-out-btn" @click="handleLoginOut">退出登录</button>
    </view>
  </wrapper>
  <xm-tabbar></xm-tabbar>
</template>

<script lang="ts" setup>
/* img */
import avatarImg from '@/static/image/person-avatar.png'
/* components */
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'
import wrapper from '@/layouts/wrapper.vue'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'

/* store */
import { useSystemStore, useUserStore } from '@/store/index'

defineOptions({
  name: 'personal',
})

onLoad(() => {
  uni.hideTabBar()
})

const userStore = useUserStore()
const { user_name: userName, phone, company_name: companyName } = userStore.userInfo

interface IRouterItem {
  icon: string // 图标
  label: string // 标题
  value: string // 文字
  path: string // 路由
}

/* 路由跳转信息 */
const routerList = reactive<IRouterItem[]>([
  {
    icon: 'chat',
    label: '我的消息',
    value: '园洲花园8栋16号',
    path: '',
  },
  {
    icon: 'usergroup',
    label: '关于我们',
    value: '230101114',
    path: '',
  },
  {
    icon: 'file',
    label: '档案资料',
    value: '',
    path: '/pages/elevator-list/elevator-list',
  },
  {
    icon: 'lock-on',
    label: '修改密码',
    value: '一号楼',
    path: '',
  },
])

// 路由跳转
function handleClickRouteItem(item: IRouterItem) {
  if (item.path !== '') {
    uni.navigateTo({ url: item.path })
  } else {
    uni.showToast({
      title: '暂未开放',
      icon: 'none',
    })
  }
}

const systemStore = useSystemStore()
const handleLoginOut = () => {
  uni.navigateTo({ url: '/pages/login/login' })
  systemStore.resetTabBarIdx()
}
</script>

<style lang="scss">
$rpx-120: px2rpx(120);
$rpx-144: px2rpx(144);

.header {
  @extend %flex-center;
  flex-shrink: 0;
  gap: $rpx-16;
  justify-content: flex-start;
  height: $rpx-120;
  padding: 0 $rpx-24 $rpx-30;
  background: $color-secondary;
  .avatar {
    @extend %flex-center;
    width: $rpx-80;
    height: $rpx-80;
    border-radius: 50%;
  }
  .info {
    @extend %flex-column;
    justify-content: space-around;
    height: $rpx-80;

    .text {
      @extend %font-size-xs;
      font-family: Bebas Neue;
      color: $color-white;
    }
  }
}

.content {
  flex-grow: 1;
  @extend %flex-column;
  gap: $rpx-12;
  justify-content: flex-start;
  // height: calc(100vh - $rpx-90 - $rpx-120 + $rpx-24);
  padding-top: $rpx-30;
  margin-top: -$rpx-24;
  background: #f8f9fa;
  border-radius: $rpx-30 $rpx-30 0 0;
  .login-out-btn {
    @extend %btn-reset;
    @extend %flex-center;
    width: 75%;
    height: $rpx-60;
    padding-left: 0.5rem;
    margin: 0 auto;
    font-family: Nunito; //TODO: 字体
    font-size: $rpx-24;
    font-weight: 400;

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
