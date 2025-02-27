<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useSystemStore } from './store'
const useSystem = useSystemStore()

onLaunch(() => {
  getTopBarHeight()
})

function getTopBarHeight() {
  // #ifndef H5 || APP-PLUS || MP-ALIPAY
  const menuInfo = uni.getMenuButtonBoundingClientRect()
  console.log('system--menuInfo :>> ', menuInfo)
  // 导航栏内容的高度 = (胶囊底部的高度 - 状态栏的高度) + (胶囊顶部的高度 - 状态栏的高度)
  useSystem.setNavigatorPadding(menuInfo.top, menuInfo.height)
  // #endif
}
</script>

<style lang="scss">
/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
