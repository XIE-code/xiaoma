<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '电梯知识库',
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
        <view class="title">电梯知识库</view>
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

    <!-- 内容区域 -->

    <view class="scroll-box">
      <view class="recommend-box">
        <view class="recommend-title">推荐品牌</view>
        <wd-grid clickable>
          <wd-grid-item
            use-icon-slot
            use-text-slot
            v-for="recommendCompany in recommendCompanyList"
            :key="recommendCompany.id"
            :iconSize="px2rpx(55)"
            custom-class="custom-class-item"
            link-type="navigateTo"
            :url="navigatorToSecondaryCategory(recommendCompany)"
          >
            <template #icon>
              <image
                class="grid-item-img"
                :src="getServerImg(recommendCompany.logoUrl)"
                @error="handleLoadImgError"
                mode="aspectFit"
              />
            </template>
            <template #text>
              <text class="grid-item-text">
                {{ recommendCompany.name }}
              </text>
            </template>
          </wd-grid-item>
        </wd-grid>
      </view>
      <view class="company-box">
        <wd-index-bar sticky>
          <view v-for="indexItemList in companyList" :key="indexItemList.index">
            <wd-index-anchor custom-class="wd-index-bar__index" :index="indexItemList.index" />
            <wd-cell
              border
              center
              clickable
              size="large"
              v-for="company in indexItemList.data"
              :key="company.id"
              :title="company.name"
              is-link
              :to="navigatorToSecondaryCategory(company)"
            >
              <template #icon>
                <image
                  :src="getServerImg(company.logoUrl)"
                  @error="handleLoadImgError"
                  class="item-icon"
                  mode="aspectFit"
                />
              </template>
            </wd-cell>
          </view>
        </wd-index-bar>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* 第三方库 */
import { pinyin } from 'pinyin-pro'
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* store */
import { useSystemStore } from '@/store'
/* service */
import { postKnowledgeCategoryList } from '@/service/elevator'
import type { IKnowledgeCategoryListResponse } from '@/service/elevator'
/* utils */
import { getServerImg, px2rpx, handleLoadImgError } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'

const systemStore = useSystemStore()
// 导航栏
function handleClickLeft() {
  systemStore.resetTabBarIdx()
  uni.switchTab({ url: '/pages/index/index' })
}

function handleSearch() {
  console.log('触发搜索事件 :>> ')
}

/* TODO: 提取公共模块 */
const navigatorToSecondaryCategory = (company: IKnowledgeCategoryListResponse) => {
  return `/pages/knowledge-category/knowledge-category?id=${company.id}&name=${company.name}`
}

// 内容区域
interface IIndexList {
  index: string
  data: IKnowledgeCategoryListResponse[]
}

/* 根据中文获取拼音首字母 */
const getUpperCaseByName = (name: string) => {
  return pinyin(name, { toneType: 'none' })[0].toUpperCase()
}

/* 根据首个拼音第一个英文顺序排序 */
const sortByPinYinIndex = (first: IIndexList, second: IIndexList) => {
  return first.index.localeCompare(second.index)
}

/* 根据拼音顺序排序 */
const sortByPinYin = (
  first: IKnowledgeCategoryListResponse,
  second: IKnowledgeCategoryListResponse,
) => {
  const firstName = pinyin(first.name, { toneType: 'none' })
  const secondName = pinyin(second.name, { toneType: 'none' })
  return firstName.localeCompare(secondName)
}

/* 公司列表数据 */
const companyList = ref<IIndexList[]>([])

postKnowledgeCategoryList({
  parent_id: 0,
})
  .then((result) => {
    const indexBarList = result.data.reduce(
      (arrList: IIndexList[], current: IKnowledgeCategoryListResponse) => {
        const index = getUpperCaseByName(current.name)
        const hasIndexList = arrList.find((current) => current.index === index)

        if (hasIndexList) {
          arrList.forEach((item) => {
            if (item.index === index) {
              item.data.push(current)
            }
          })
        } else {
          arrList.push({
            index,
            data: [current],
          })
        }

        return arrList
      },
      [],
    )

    indexBarList.sort(sortByPinYinIndex)
    indexBarList.forEach((item) => item.data.sort(sortByPinYin))
    companyList.value = indexBarList
  })
  .catch((err) => {
    console.log('err :>> ', err)
  })

const recommendCompanyList = computed(() => {
  const flatMapCompanyList = companyList.value.flatMap((item) => item.data)
  return flatMapCompanyList.slice(0, 4)
})
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
  gap: $rpx-16;
  padding: $rpx-12 $rpx-16;
  overflow: hidden;
  background: $color-white;

  @extend %flex-column;

  .recommend-box {
    flex-shrink: 0;
    height: $rpx-119;

    .recommend-title {
      padding-left: $rpx-6;
      @extend %font-size-base;
      font-weight: 600;
      border-left: $color-primary-50 solid $rpx-4;
    }

    :deep(.wd-grid) {
      .custom-class-item {
        padding: $rpx-16 $rpx-10 0 0;

        .wd-grid-item__content {
          padding: 0;
        }
        .grid-item-img {
          width: $rpx-55;
          height: $rpx-55;
        }

        .grid-item-text {
          @extend %font-size-base;
          text-align: center;
        }
      }
    }
  }

  .company-box {
    flex-grow: 1;
    overflow: auto;

    :deep(.wd-index-bar) {
      .wd-index-bar__content .wd-cell {
        padding-left: 0;

        .wd-cell__right {
          display: none;
          flex: 0;
        }

        .item-icon {
          width: $rpx-64;
          height: $rpx-32;
        }

        .wd-cell__title {
          @extend %flex-center;
          justify-content: flex-start;
          padding-left: $rpx-12;
        }
      }

      .wd-index-bar__sidebar {
        position: absolute;
        top: 40%;
        z-index: 3;

        .wd-index-bar__index {
          font-size: $rpx-16;
          text-align: center;
        }
        .is-active {
          color: $color-primary;
        }
      }
    }
  }
}
</style>
