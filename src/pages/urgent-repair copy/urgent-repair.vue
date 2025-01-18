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

      <wd-button customClass="btn-reset" @click="getLocation">获取地图信息</wd-button>
      <wd-button customClass="btn-reset" @click="chooseImage">获取拍照信息</wd-button>
      <image class="camera-img" :src="cameraImg || ''" mode="scaleToFill" />
      <view>{{ geoLocation || '地图信息' }}</view>
    </view>
  </wrapper>
  <xm-tabbar></xm-tabbar>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
import xmTabbar from '@/components/xm-tabbar/xm-tabbar.vue'

const cameraImg = ref('')
const geoLocation = ref({})

onLoad(() => {
  uni.hideTabBar()
})

const getLocation = () => {
  uni.getLocation({
    success: (success) => {
      geoLocation.value = success
      console.log('success :>> ', success)

      const appKey = '35dcbf4bcbad0bc80bc3625505156ff9'
      const baseUrl = 'http://api.tianditu.gov.cn/geocoder'
      const url = `${baseUrl}?postStr={'lon':${success.longitude},'lat':${success.latitude},'ver':1}&type=geocode&tk=${appKey}`
      uni.request({
        header: {
          'Content-Type': 'application/text',
        },
        // 注意:这里的key值需要高德地图的 web服务生成的key  只有web服务才有逆地理编码
        url,
        success(res) {
          console.log(res, '获取位置成功信息')
        },
        fail(err) {
          console.log(err, '获取位置失败信息')
        },
      })
    },
  })
}

// interface GetLocationSuccess {
//         /**
//          * 纬度，浮点数，范围为-90~90，负数表示南纬
//          */
//         latitude: number;
//         /**
//          * 经度，范围为-180~180，负数表示西经
//          */
//         longitude: number;
//         /**
//          * 速度，浮点数，单位m/s
//          */
//         speed: number;
//         /**
//          * 位置的精确度
//          */
//         accuracy: number;
//         /**
//          * 高度，单位 m
//          */
//         altitude: number;
//         /**
//          * 垂直精度，单位 m（Android 无法获取，返回 0）
//          */
//         verticalAccuracy: number;
//         /**
//          * 水平精度，单位 m
//          */
//         horizontalAccuracy: number;
//         /**
//          * 地址信息
//          */
//         address?: any;
//     }

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      console.log('res :>> ', res)
      cameraImg.value = res.tempFilePaths[0]
    },
    fail: (fail) => {
      console.log('fail :>> ', fail)
    },
  })
}
// interface ChooseImageSuccessCallbackResult {
//   /**
//    * 图片的本地文件路径列表
//    */
//   tempFilePaths: string | string[]
//   /**
//    * 图片的本地文件列表，每一项是一个 File 对象
//    */
//   tempFiles:
//     | ChooseImageSuccessCallbackResultFile
//     | ChooseImageSuccessCallbackResultFile[]
//     | File
//     | File[]
// }
</script>
<style scoped lang="scss">
/* 全局颜色变量 */
$color-white: rgb(255, 255, 255);

:deep(.wd-button.is-medium) {
  // @extend %btn-reset;
  color: $color-white;
}

.camera-img {
  @extend %border;
  width: $rpx-64;
  height: $rpx-64;
}
</style>
