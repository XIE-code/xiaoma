<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>
<template>
  <wrapper paddingType="top" :paddingBottom="90" :paddingLeft="20" :paddingRight="20" :gap="24">
    <view class="info">
      <image class="avatar" :src="`${SERVER_BASEURL}${headImg}`" mode="scaleToFill"></image>
      <view class="info-data">
        <view class="info-name">{{ userName }}</view>
        <view class="info-other">{{ phone }}&nbsp;|&nbsp;{{ companyName }}</view>
      </view>
    </view>

    <view class="state">
      <view class="box" v-for="item in elevatorList" :key="item.name">
        <text class="box-name">{{ item.name }}</text>
        <text class="box-value">{{ item.value }}</text>
      </view>
    </view>

    <view class="certificate">
      <image class="certificate-star" src="@/static/svg/star.svg" mode="scaleToFill" />
      <view class="certificate-left">
        <image class="certificate-icon" src="@/static/svg/certificate.svg" mode="scaleToFill" />
        <text class="certificate-text">个人操作证管理</text>
      </view>
      <button class="certificate-btn">查看</button>
    </view>

    <view class="content">
      <wd-cell
        clickable
        center
        size="large"
        is-link
        :to="item.path"
        :title="item.label"
        :key="idx"
        class="item"
        custom-title-class="item-title"
        custom-value-class="item-value"
        v-for="(item, idx) in routerList"
      >
        <template #icon>
          <image :src="item.icon" class="item-icon" mode="aspectFit" />
        </template>
      </wd-cell>
    </view>

    <view class="login-out">
      <button class="login-out-btn" @click="handleLoginOut">退出登录</button>
    </view>
  </wrapper>
  <xm-tabbar></xm-tabbar>
</template>

<script lang="ts" setup>
/* components */
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'
import wrapper from '@/layouts/wrapper.vue'
/* store */
import { useSystemStore, useUserStore } from '@/store/index'
/* constant */
import { SERVER_BASEURL } from '@/common/constant'
/* svg */
import myNewsSVG from '@/static/svg/my-news.svg'
import aboutUsSvg from '@/static/svg/about-us.svg'
import archiveSVG from '@/static/svg/archive.svg'
import changePwdSVG from '@/static/svg/change-password.svg'
/* img */
import avatarImg from '@/static/image/person-avatar.png'
defineOptions({
  name: 'personal',
})

onLoad(() => {
  uni.hideTabBar()
})

const userStore = useUserStore()
const { userName, phone, companyName, headImg } = userStore.userInfo

const elevatorList = reactive([
  {
    name: '今日维保电梯数',
    value: '0',
  },
  {
    name: '未完成维保电梯数',
    value: '0',
  },
  {
    name: '预警电梯数',
    value: '0',
  },
])

interface IRouterItem {
  icon: string // 图标
  label: string // 标题
  value: string // 文字
  path: string // 路由
}

/* 路由跳转信息 */
const routerList = reactive<IRouterItem[]>([
  {
    icon: myNewsSVG,
    label: '我的消息',
    value: '园洲花园8栋16号',
    path: '',
  },
  {
    icon: aboutUsSvg,
    label: '关于我们',
    value: '230101114',
    path: '',
  },
  {
    icon: archiveSVG,
    label: '档案资料',
    value: '',
    path: '/pages/elevator-list/elevator-list',
  },
  {
    icon: changePwdSVG,
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
$rpx-15: px2rpx(15);
$rpx-87: px2rpx(87);

$rpx-120: px2rpx(120);
$rpx-128: px2rpx(128);
$rpx-144: px2rpx(144);

$color-bg-gold-50: rgba(255, 176, 23, 0.5);

.info {
  @extend %flex-center;
  justify-content: flex-start;
  height: $rpx-64;
  margin-top: $rpx-30;

  .avatar {
    flex-shrink: 0;
    @extend %flex-center;
    width: $rpx-64;
    height: $rpx-64;
    border-radius: 50%;
  }

  .info-data {
    flex-grow: 1;
    @extend %flex-column;
    justify-content: space-between;
    height: $rpx-64;
    padding: $rpx-4 $rpx-16;
    overflow: hidden;

    .info-name {
      @extend %font-size-xl;
      color: $color-card-head;
    }

    .info-other {
      @extend %font-size-sm;
      color: $color-gray-70;
      @extend %ellipsis;
    }
  }
}

.state {
  @extend %flex-center;
  gap: $rpx-12;
  width: 100%;
  padding: $rpx-16 0;

  .box {
    @extend %flex-column;
    gap: $rpx-8;
    align-items: center;
    justify-content: space-between;

    width: calc((100% - $rpx-24) / 3);
    height: 100%;

    .box-name {
      @extend %font-size-sm;
      width: 100%;
      height: $rpx-20;
      overflow: visible;
      color: $color-gray-70;
      text-align: center;
      white-space: nowrap;
    }
    .box-value {
      @extend %font-size-xl;
      font-weight: 600;
    }
  }
}

.certificate {
  position: relative;
  flex-shrink: 0;
  gap: $rpx-12;
  width: 100%;
  height: $rpx-64;
  padding: $rpx-16;
  overflow: hidden;
  font-weight: 600;
  border-radius: $rpx-12;
  box-shadow: 0 $rpx-4 $rpx-16 0 $color-bg-red-50;
  @extend %flex-between;
  @extend %font-size-sm;

  &::before {
    @extend %absolute;
    background: $color-bg-red;
  }

  &::after {
    @extend %absolute;
    background: linear-gradient(to right, $color-white, $color-white-50);
    opacity: 0.5;
  }

  .certificate-left {
    z-index: 1;
    @extend %flex-between;
    gap: $rpx-12;

    .certificate-icon {
      width: $rpx-32;
      height: $rpx-32;
    }
    .certificate-text {
      color: $color-gray-90;
    }
  }

  .certificate-btn {
    z-index: 1;
    @extend %flex-center;
    height: $rpx-32;
    padding: $rpx-6 $rpx-16;
    margin-right: $rpx-15;
    @extend %font-size-sm;
    font-weight: 600;
    color: $color-white;

    background-color: $color-bg-red;
    border-radius: $rpx-16;
  }

  .certificate-star {
    position: absolute;
    top: -$rpx-3;
    right: -$rpx-12;
    z-index: 1;
    width: $rpx-87;
    height: $rpx-87;
  }
}

.content {
  @extend %flex-column;
  gap: $rpx-24;
  justify-content: flex-start;
  padding: $rpx-16;

  background: $color-bg-gold-50;
  border: $rpx-1 solid $color-bg-gold-50;
  border-radius: $rpx-12;

  :deep(.wd-cell.is-large.is-center) {
    height: $rpx-32;
    padding: 0;
    background-color: transparent;
    .wd-cell__wrapper {
      padding: 0;

      .item-icon {
        width: $rpx-32;
        height: $rpx-32;
      }

      .item-title {
        margin-left: $rpx-12;

        @extend %font-size-sm;
        font-weight: 600;
        line-height: $rpx-32;
        color: $color-gray-90;
      }

      .wd-cell__arrow-right {
        color: $color-gray-90;
      }
    }
  }
}

.login-out {
  display: flex;
  justify-content: flex-end;

  .login-out-btn {
    @extend %flex-center;
    @extend %btn-reset;

    width: $rpx-128;
    height: $rpx-48;

    @extend %font-size-base;
    font-weight: 600;
    color: $color-bg-red;
    background: transparent;
  }
}
</style>
