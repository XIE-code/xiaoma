<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '电梯知识库次级目录',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="header">
      <view class="header-nav">
        <wd-icon
          name="arrow-left"
          @click="handleClickLeft"
          :size="px2rpx(24)"
          color="white"
        ></wd-icon>
        <view class="title">{{ parentInfo.companyName }} / {{ parentInfo.name }}</view>
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
          center
          border
          size="large"
          :title="item.title"
          :key="idx"
          icon="file-pdf"
          custom-icon-class="item-icon"
          custom-title-class="item-title"
          custom-value-class="item-value"
          v-for="(item, idx) in categoryList"
        >
          <view class="item-value__left">
            <wd-icon name="browse" :size="px2rpx(16)"></wd-icon>
            0
            <!-- todo -->
          </view>
          <wd-button
            @click="handleClickFile(item)"
            type="primary"
            size="small"
            custom-class="item-value__btn"
          >
            主要按钮
          </wd-button>
        </wd-cell>
      </view>
      <empty v-else />
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
import empty from '@/components/empty/empty.vue'
/* service */
import { postKnowledgeDocumentList } from '@/service/elevator'
import type {
  IKnowledgeDocumentListParams,
  IKnowledgeDocumentListResponse,
} from '@/service/elevator'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY, SERVER_BASEURL } from '@/common/constant'

// 导航栏
function handleClickLeft() {
  uni.navigateBack()
}

/* content */
let parentInfo = {
  id: 0,
  name: '',
  companyName: '',
}

const pageObj = ref<IKnowledgeDocumentListParams>({
  category_id: 0,
  limit: 99,
  page: 1,
})
const categoryList = ref<IKnowledgeDocumentListResponse[]>([])
/* qs */
const navigatorToDocument = (file: IKnowledgeDocumentListResponse) => {
  return `/pages/web-viewer/web-viewer?url=${file.filePath}`
}
/* 获取知识库二级目录列表 */
const getPageKnowledgeDocumentList = (item: number) => {
  return postKnowledgeDocumentList(pageObj.value)
}

onLoad((options) => {
  parentInfo = { id: Number(options.id), name: options.name, companyName: options.companyName }
  pageObj.value.category_id = options.id
  getPageKnowledgeDocumentList(options.id)
    .then((result) => {
      categoryList.value = result.data
      console.log('getPageKnowledgeDocumentList :>> ', result)
    })
    .catch((err) => {
      console.log('getPageKnowledgeCategoryList err :>> ', err)
    })
})

function handleSearch() {
  console.log('触发搜索事件 :>> ')
}

const handleClickFile = (item: IKnowledgeDocumentListResponse) => {
  console.log('1 :>> ', 1)
  // #ifdef MP-WEIXIN
  wx.downloadFile({
    // 示例 url，并非真实存在
    url: SERVER_BASEURL + item.filePath,
    success: function (res) {
      const filePath = res.tempFilePath
      wx.openDocument({
        filePath,
        success: function (res) {
          console.log('打开文档成功')
        },
      })
    },
  })
  // #endif
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
      position: relative;
      padding: 0;

      .wd-cell__left {
        align-items: flex-start;
        height: $rpx-48;
        margin-right: 0;

        .item-icon {
          @extend %flex-center;
          width: $rpx-32;
          height: $rpx-48;
          font-size: $rpx-32;
          color: red;
        }

        .item-title {
          @extend %font-size-sm;
          line-height: $rpx-32;
          color: $color-gray-90;
        }
      }

      .wd-cell__right {
        position: absolute;
        right: 0;
        bottom: -$rpx-12;

        width: 100%;
        height: $rpx-32;
        padding-left: $rpx-32;

        .item-value {
          @extend %flex-center;
          justify-content: space-between;
          // width: $rpx-48;

          .item-value__left {
            @extend %flex-center;
            gap: $rpx-6;
            padding-left: $rpx-4;
            color: lightgray;
          }
          .item-value__btn {
            @extend %flex-center;
            justify-content: flex-end;
            height: $rpx-24;
            margin: 0;
            color: $color-white;
            background-color: $color-primary;
            border-radius: $rpx-12;
          }
        }
      }
    }
  }
}
</style>
