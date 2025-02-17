<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '签到打卡',
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
        <view class="title">签到打卡</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="scroll-box">
      <view class="container">
        <view>地点： {{ liftInfo.address }}</view>
        <view>电梯名称： {{ liftInfo.name }}</view>
        <view>维保类型： {{ maintenance.maintType }}</view>
        <view>维保状态： {{ getMaintenanceType(maintenance.isMaintain) }}</view>

        <view v-if="maintenance.isMaintain === 1">
          <!-- TODO: 区分运行环境 -->
          <button hover-class="button-hover" @click="handleSignIn" class="btn-sign">
            <!-- :disabled="signInDistance > 500" -->
            {{ `${signInDistance <= 500 ? '点击签到' : '距离过远'}` }}
          </button>
          <view>当前位置： {{ currentPosition.address }}</view>
        </view>
        <view v-else-if="maintenance.isMaintain === 2">
          <view>
            <button @click="takePhoto">拍照上传</button>
            <view>
              <canvas canvas-id="myCanvas" style="width: 300px; height: 300px"></canvas>
            </view>
          </view>
          <view>
            <view>
              <canvas
                canvas-id="signatureCanvas"
                style="width: 300px; height: 200px; border: 1px solid #000"
                @touchstart="startSign"
                @touchmove="moveSign"
                @touchend="endSign"
              ></canvas>
            </view>
            <button @click="saveSignature">保存签名</button>
          </view>
          <button>确认</button>
        </view>
        <view v-else-if="maintenance.isMaintain === 3">已完成维保</view>

        <!-- #ifdef H5 -->
        <!-- <button>请在微信小程序授权获取定位</button> -->
        <!-- #endif -->
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* API */
import gcoord from 'gcoord'
import QQMapWX from './qqmap-wx-jssdk'

/* store */
import { useSystemStore } from '@/store'
/* service */
import { postLiftList, postMaintenanceDetail } from '@/service/lift/lift'
import { IElevatorInfo, ILiftListResponse, IMaintenanceBasis } from '@/service/lift/type'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
import { indexPage, liftDetailPage } from '@/common/pages'

const systemStore = useSystemStore()
const { capsule } = systemStore.systemInfo

const qqmapsdk = new QQMapWX({
  key: 'ND2BZ-7BL3U-6JKV7-GSGY3-QBI57-VHF7R',
})

// 导航栏
function handleClickLeft() {
  systemStore.resetTabBarIdx()
  uni.switchTab({ url: indexPage })
}

const liftInfo = ref<Partial<IElevatorInfo>>({
  longitude: 0,
  latitude: 0,
})

const maintenance = ref<Partial<IMaintenanceBasis>>({
  maintType: '',
})

const getMaintenanceType = (type: number) => {
  // 1：待维保， 2：已维保 ：3：进行中：4：逾期签到
  switch (type) {
    case 1:
      return '待维保'
    case 2:
      return '已维保'
    case 3:
      return '进行中'
    case 4:
      return '逾期签到'
    default:
      return ''
  }
}

/* 地理位置 */
const currentPosition = ref({
  longitude: 0,
  latitude: 0,
  address: '',
})

// 定位距离
const signInDistance = ref(0)

onLoad((options) => {
  const liftId = options.id
  postMaintenanceDetail({ id: liftId })
    .then((result) => {
      liftInfo.value = result.ele
      maintenance.value = result.basis
      getSetting()
    })
    .catch((err) => {
      console.log('postLiftGetRun err:>> ', err)
    })
})

// onPullDownRefresh() {
//     // 执行下拉刷新操作
//     console.log('执行下拉刷新操作');

//     // 模拟数据请求
//     setTimeout(() => {
//       // 停止下拉刷新动画
//       uni.stopPullDownRefresh();
//     }, 2000);
//   }

// 定义一个名为 getSetting 的函数，用于获取设置信息
function getSetting() {
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.userLocation']) {
        wx.authorize({
          scope: 'scope.userLocation',
          success() {
            // 用户已授权，判断是否开启手机定位
            getLocation()
          },
          fail() {
            // 用户拒绝授权
            wx.showToast({
              title: '需要开启定位权限',
              icon: 'none',
            })
          },
        })
      } else {
        // 用户已授权，直接调用wx.getLocation
        getLocation()
      }
    },
  })
}

// 获取定位
function getLocation() {
  wx.getLocation({
    type: 'gcj02',
    isHighAccuracy: true, // 开启高精度定位
    success(res) {
      currentPosition.value.longitude = res.longitude // 经度
      currentPosition.value.latitude = res.latitude // 纬度
      console.log('维度、经度 :>> ', res.latitude, res.longitude)
      calculateDistance()
      getAddress()
    },
    fail(err) {
      if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
        // 用户拒绝授权
        wx.showToast({
          title: '定位权限被拒绝',
          icon: 'none',
        })
      } else if (err.errMsg.includes('位置服务未开启')) {
        // 位置服务未开启
        wx.showModal({
          title: '提示',
          content: '请开启手机定位服务',
          showCancel: false,
        })
      } else {
        // 其他错误
        wx.showToast({
          title: '获取位置失败',
          icon: 'none',
        })
      }
    },
  })
}

// 计算距离
// 注：坐标系采用gcj02坐标系
// 起点坐标，格式：lat,lng;lat,lng…   from=39.071510,117.190091
// 终点坐标，格式：lat,lng;lat,lng…  to=39.071510,117.190091;
function calculateDistance() {
  if (!currentPosition.value.latitude || !currentPosition.value.longitude) {
    console.log('获取用户定位失败 :>> ')
    return
  }
  const from = `${currentPosition.value.latitude},${currentPosition.value.longitude}`
  const to = gcoord.transform(
    [liftInfo.value.latitude, liftInfo.value.longitude],
    gcoord.BD09,
    gcoord.GCJ02,
  )

  // // #ifdef MP-WEIXIN
  qqmapsdk.calculateDistance({
    from,
    to: `${to[0]},${to[1]}`,
    mode: 'straight', // 计算直线距离
    success: (res) => {
      signInDistance.value = res.result.elements[0].distance
      console.log('距离签到位置 :>> ', signInDistance.value)
    },
    fail: (err) => {
      console.error('计算距离失败', err)
    },
  })
  // #endif
}

// 定义一个名为 getAddress 的函数，用于根据经纬度获取详细地址信息
// 调用 qqmapsdk 的 reverseGeocoder 方法进行逆地理编码
function getAddress() {
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: currentPosition.value.latitude, // 纬度
      longitude: currentPosition.value.longitude, // 经度
    },
    // 成功回调函数，当逆地理编码成功时执行
    success(res) {
      // 从返回结果中提取推荐格式的详细地址
      const addressComponent = res.result.address_component
      const addressReference = res.result.address_reference
      currentPosition.value.address = `${addressComponent.nation}${addressComponent.province}${addressComponent.city}${addressComponent.district}${addressReference.town.title}${addressReference.landmark_l2.title}`
      // 在控制台输出提取到的详细地址
      console.log('详细地址', currentPosition.value.address)
    },
    // 失败回调函数，当逆地理编码失败时执行
    fail(err) {
      // 在控制台输出错误信息
      console.error('获取地址失败', err)
    },
  })
}

// 点击签到
function handleSignIn() {
  // 切换签到状态

  maintenance.value.isMaintain = 2

  // postSignIn({ id: liftInfo.value.id })
  //   .then((result) => {
  //     uni.showToast({
  //       title: '签到成功',
  //       icon: 'none',
  //     })
  //     uni.navigateBack()
  //   })
  //   .catch((err) => {
  //     console.log('postSignIn err:>> ', err)
  //   })
}

const imageSrc = ref('')

// 定义一个名为 takePhoto 的函数，用于拍照操作
function takePhoto() {
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['camera'],
    // camera: 'back',
    success: (res) => {
      const tempFiles = res.tempFiles
      imageSrc.value = tempFiles[0].tempFilePath
      drawWatermark()
      // uploadImage(imageSrc.value)
    },
    fail: (err) => {
      console.error('拍照失败', err)
    },
  })
}

// 获取当前时间
const currentTime = new Date().toLocaleString()

// 定义一个名为 getLocationAndTime 的函数，用于获取地理位置和时间信息
function getLocationAndTime() {
  // 获取地理位置
  wx.getLocation({
    type: 'wgs84',
    success: (res) => {
      const latitude = res.latitude
      const longitude = res.longitude
      // this.location = `纬度: ${latitude}, 经度: ${longitude}`;
      drawWatermark()
    },
    fail: () => {
      wx.showToast({
        title: '获取位置失败',
        icon: 'none',
      })
    },
  })
}

// 定义一个名为 drawWatermark 的函数，用于绘制水印
function drawWatermark() {
  const ctx = wx.createCanvasContext('myCanvas')
  ctx.drawImage(imageSrc.value, 0, 0, 300, 300)

  // 添加时间水印
  ctx.setFontSize(20)
  ctx.setFillStyle('rgba(255, 255, 255, 0.5)')
  ctx.fillText(currentTime, 10, 280)

  // 添加地点水印
  ctx.setFontSize(20)
  ctx.setFillStyle('rgba(255, 255, 255, 0.5)')
  ctx.fillText(currentPosition.value.address, 10, 250)

  ctx.draw(false, () => {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: (res) => {
        const watermarkedImage = res.tempFilePath
        uploadImage(watermarkedImage)
      },
    })
  })
}

const isSigning = ref(false)

const startSign = (e) => {
  console.log('startSign')
  if (!isSigning.value) {
    isSigning.value = true
    const ctx = wx.createCanvasContext('signatureCanvas')
    ctx.moveTo(e.touches[0].x, e.touches[0].y)
    ctx.setStrokeStyle('black') // 设置笔的颜色为黑色
  }
}

const moveSign = (e) => {
  console.log('moveSign')

  if (isSigning.value) {
    const ctx = wx.createCanvasContext('signatureCanvas')
    ctx.lineTo(e.touches[0].x, e.touches[0].y)
    ctx.stroke()
    ctx.draw(true)
    ctx.draw(false) // 确保每次绘制后都会触发绘制更新
  }
}

const endSign = () => {
  console.log('moveSign')
  isSigning.value = false
}

const saveSignature = () => {
  wx.canvasToTempFilePath({
    canvasId: 'signatureCanvas',
    success: (res) => {
      const signaturePath = res.tempFilePath
      uploadImage(signaturePath)
    },
    fail: (err) => {
      console.error('生成签名图片失败', err)
    },
  })
}

const uploadImage = (filePath) => {
  wx.uploadFile({
    url: 'YOUR_UPLOAD_URL', // 替换为你的上传接口地址
    filePath,
    name: 'file',
    success: (res) => {
      const data = res.data
      // 处理上传成功后的逻辑
    },
    fail: (err) => {
      console.error('上传失败', err)
    },
  })
}
</script>

<style lang="scss" scoped>
$rpx-11: px2rpx(11);
$rpx-17: px2rpx(17);
$rpx-19: px2rpx(19);

$rpx-92: px2rpx(92);

.header {
  @extend %flex-column;
  gap: $rpx-10;
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
}

.scroll-box {
  flex-grow: 1;
  overflow: hidden;
  /* 内容区域 */
  .container {
    @extend %flex-column;
    gap: $rpx-16;
    justify-content: flex-start;
    height: 100%;
    overflow: scroll;
    background: $color-white;
    border-radius: $rpx-20 $rpx-20 0 0;
    @extend %padding-base;

    .btn-sign {
      @extend %btn-reset;
      @extend %flex-center;
      @extend %font-size-lg;
      width: 50%;
      aspect-ratio: 1 / 1;
      margin: 0 auto;
      margin-bottom: $rpx-10;
      border-radius: 50%;
    }
  }
}
</style>
