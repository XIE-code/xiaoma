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
      <view class="my-2">急修页面-待开发</view>

      <!-- <wd-button type="success" @click="handleClickBtn" class="my-6">获取数据</wd-button>
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
      </wd-button> -->
    </view>
  </wrapper>
  <xm-tabbar></xm-tabbar>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'
/* api */
import {
  postBreakdownCode,
  postKnowledgeCategoryList,
  postKnowledgeDocumentList,
  postLiftGetRun,
  postLiftLiftAdd,
  postLiftList,
} from '@/service/elevator'

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
