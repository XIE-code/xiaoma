<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '电梯知识库文件夹目录',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="header">
      <view class="header-nav">
        <wd-icon
          name="arrow-left"
          @click="handleClickBack"
          :size="px2rpx(24)"
          color="white"
        ></wd-icon>
        <view class="title">{{ companyName }}</view>
      </view>
      <view class="search-bar">
        <input
          confirm-type="search"
          @confirm="handleSearch"
          class="search-input"
          placeholder="请输入"
        />
        <button class="search-btn">
          <wd-icon name="search" color="white" :size="px2rpx(12)"></wd-icon>
        </button>
      </view>
    </view>

    <view class="scroll-box">
      <view v-if="categoryList.length !== 0">
        <wd-cell
          clickable
          center
          border
          size="large"
          is-link
          :to="navigatorToDocument(item)"
          :title="item.name"
          :key="idx"
          class="item"
          custom-title-class="item-title"
          custom-value-class="item-value"
          v-for="(item, idx) in categoryList"
        >
          <template #icon>
            <image :src="documentImg" class="item-icon" mode="aspectFit" />
          </template>
        </wd-cell>
      </view>
      <empty v-else />
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* service */
import { postKnowledgeCategoryList } from '@/service/knowledge/knowledge'
import type { IKnowledgeCategoryListResponse } from '@/service/knowledge/type'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
/* img */
import documentImg from '@/static/image/document.png'
import { knowledgeFilePage } from '@/common/pages'

// 导航栏
function handleClickBack() {
  uni.navigateBack()
}

/* content */
let companyName = ''

const categoryList = ref<IKnowledgeCategoryListResponse[]>([])
/* qs */
const navigatorToDocument = (category: IKnowledgeCategoryListResponse) => {
  return `${knowledgeFilePage}?id=${category.id}&name=${category.name}&companyName=${companyName}`
}
/* 获取知识库二级目录列表 */
const getPageKnowledgeCategoryList = (item: number) => {
  return postKnowledgeCategoryList({
    parent_id: item,
  })
}

onLoad((options) => {
  companyName = options.name
  getPageKnowledgeCategoryList(options.id)
    .then((result) => {
      categoryList.value = result
    })
    .catch((err) => {
      console.log('getPageKnowledgeCategoryList err :>> ', err)
    })
})

function handleSearch() {
  console.log('触发搜索事件 :>> ')
}
</script>

<style lang="scss" scoped>
$rpx-11: px2rpx(11);
$rpx-17: px2rpx(17);
$rpx-19: px2rpx(19);

$rpx-55: px2rpx(55);

$rpx-92: px2rpx(92);
$rpx-119: px2rpx(119);

.header {
  flex-shrink: 0;
  gap: $rpx-10;
  height: $rpx-92;
  @extend %flex-column;
  padding: 0 $rpx-24 $rpx-10;

  .header-nav {
    @extend %flex-center;
    gap: $rpx-16;
    justify-content: flex-start;
    height: $rpx-32;
    background: $color-secondary;

    .title {
      @extend %font-size-xl;
      @extend %flex-center;
      height: $rpx-28;
      color: $color-white;
    }
  }

  .search-bar {
    @extend %flex-center;
    height: $rpx-40;
    padding: $rpx-8 $rpx-12;
    background: $color-white;
    border: $rpx-1 solid $color-border;
    border-radius: $rpx-20;

    .search-input {
      @extend %font-size-xs;
      flex-grow: 1;
      height: $rpx-24;
      color: $color-placeholder;
    }

    .search-btn {
      @extend %btn-reset;
      @extend %flex-center;
      flex-shrink: 0;
      width: $rpx-24;
      height: $rpx-24;
      background: $color-primary;
      border-radius: $rpx-8;
    }
  }
}

.scroll-box {
  flex-grow: 1;
  @extend %flex-column;
  justify-content: flex-start;
  padding: $rpx-12 $rpx-16;
  overflow: scroll;
  background: $color-white;

  :deep(.wd-cell.is-large.is-center) {
    height: $rpx-48;
    padding: 0;
    background-color: transparent;
    .wd-cell__wrapper {
      padding: 0;

      .wd-cell__left {
        align-items: center;
        height: $rpx-48;

        .item-icon {
          width: $rpx-32;
          height: $rpx-32;
        }

        .item-title {
          margin-left: $rpx-12;

          @extend %font-size-sm;
          line-height: $rpx-32;
          color: $color-gray-90;
        }
      }

      .wd-cell__right {
        flex-basis: $rpx-32;
        flex-grow: 0;
        @extend %flex-center;
      }
    }
  }
}
</style>
