<route lang="json5">
{
  layout: 'demo',
  style: {
    navigationBarTitleText: '急修',
  },
}
</route>

<template>
  <wrapper paddingType="top" :paddingBottom="90">
    <view class="p-6 text-center">
      <view class="my-2">使用的是 laf 云后台</view>
      <view class="text-green-400">我的推荐码，可以获得佣金</view>

      <!-- #ifdef H5 -->
      <view class="my-2">
        <a class="my-2" :href="recommendUrl" target="_blank">{{ recommendUrl }}</a>
      </view>
      <!-- #endif -->

      <!-- #ifndef H5 -->
      <view class="my-2 text-left text-sm">{{ recommendUrl }}</view>
      let x =
      <view class="my-2 text-left text-sm">{{ outData }}</view>
      <!-- #endif -->

      <!-- http://localhost:9000/#/pages/index/request -->

      <wd-button type="success" @click="handleClickBtn" class="my-6">获取数据</wd-button>
      <wd-button type="success" @click="handleClickLiftListBtn" class="my-6">
        获取LiftList数据
      </wd-button>
      <wd-button type="success" @click="handleClickLiftGetRunBtn" class="my-6">
        电梯监控-运行与统计-累加数据
      </wd-button>
      <wd-button type="success" @click="handleClickSystemBtn">获取微信信息</wd-button>
      <wd-button type="success" @click="handleClickAddLiftBtn">添加电梯</wd-button>
      <wd-button type="success" @click="handleClickKnowledgeCategoryListBtn">
        获取知识库类目表
      </wd-button>
      <wd-button type="success" @click="handleClickKnowledgeDocumentListBtn">
        获取知识库文件列表
      </wd-button>
    </view>
  </wrapper>
  <xm-tabbar></xm-tabbar>
</template>

<script lang="ts" setup>
/* API */
import {
  postBreakdownCode,
  postKnowledgeCategoryList,
  postKnowledgeDocumentList,
  postLiftGetRun,
  postLiftLiftAdd,
  postLiftList,
} from '@/service/elevator'
/* components */
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'
import wrapper from '@/layouts/wrapper.vue'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'

const recommendUrl = ref('http://laf.run/signup?code=ohaOgIX')

const outData = ref({})

onLoad(() => {
  uni.hideTabBar()
})

/* TODO: */
const handleClickBtn = () => {
  postBreakdownCode({ devices_id: '0' })
    .then((res) => {})
    .catch((err) => {
      console.log('err :>> ', err)
    })
}
/* TODO: */
const handleClickLiftListBtn = () => {
  postLiftList({
    village_id: '1',
    lift_name: '玖玖新能源公司',
    limit: '10',
    page: '1',
    state: '1',
  })
    .then((res) => {})
    .catch((err) => {
      console.log('err :>> ', err)
    })
}

/* TODO:  */
const handleClickLiftGetRunBtn = () => {
  postLiftGetRun({
    code: '230000011',
  })
    .then((res) => {})
    .catch((err) => {
      console.log('err :>> ', err)
    })
}

/* TODO: SystemInfo */
const handleClickSystemBtn = () => {
  const systemInfo = uni.getSystemInfoSync()
  const { safeArea, safeAreaInsets } = systemInfo
  uni.showToast({
    title: '获取系统信息成功: ' + JSON.stringify(systemInfo),
    icon: 'success',
    mask: true,
  })
  outData.value = systemInfo
}

/* 添加电梯 */
const handleClickAddLiftBtn = () => {
  postLiftLiftAdd({
    name: 'test',
    register_code: 'test',
    devices_id: 'test',
    floor: 'test',
    station: 1,
    door: 1,
    load: 'test',
    speed: 'test',
  })
    .then((res) => {
      console.log('res :>> ', res)
    })
    .catch((err) => {
      console.log('err :>> ', err)
    })
}
/* 获取知识库类目表 */
const handleClickKnowledgeCategoryListBtn = () => {
  postKnowledgeCategoryList({
    parent_id: 0,
  })
    .then((res) => {
      console.log('res :>> ', res)
    })
    .catch((err) => {
      console.log('err :>> ', err)
    })
}
/* 获取知识库文件列表 */
const handleClickKnowledgeDocumentListBtn = () => {
  postKnowledgeDocumentList({
    category_id: 0,
    limit: 10,
    page: 1,
  })
    .then((res) => {
      console.log('res :>> ', res)
    })
    .catch((err) => {
      console.log('err :>> ', err)
    })
}
</script>
