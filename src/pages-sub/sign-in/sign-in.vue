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
          @click="handleClickBack"
          :size="px2rpx(24)"
          color="white"
        ></wd-icon>
        <view class="title">签到打卡</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="scroll-box">
      <view class="container">
        <view>电梯地址： {{ liftInfo.address }}</view>
        <view>电梯名称： {{ liftInfo.name }}</view>
        <view>维保类型： {{ maintenance.maintType }}</view>
        <view>维保状态： {{ getMaintenanceType(maintenance.isMaintain) }}</view>

        <!-- 	维保状态,1：待维保， 2：已维保 ：3：进行中：4：逾期签到   -->
        <view v-if="maintenance.isMaintain === 3" class="sign-in">
          <!-- <view v-if="maintenance.isMaintain === 1" class="sign-in"> -->
          <button
            hover-class="button-hover"
            @click="handleSignIn"
            :class="`btn-sign ${signInDistance <= 500 ? 'online' : 'offline'}`"
          >
            {{ `${signInDistance <= 500 ? '点击签到' : '距离过远'}` }}
          </button>
          <view>当前位置： {{ currentPosition.address }}</view>
        </view>
        <!-- 	维保状态,1：待维保， 2：已维保 ：3：进行中：4：逾期签到   -->
        <view v-else-if="maintenance.isMaintain === 1" class="clock-in">
          <!-- <view v-else-if="maintenance.isMaintain === 3" class="clock-in"> -->
          <template v-if="isMaintainingTableState === true">
            <maintenance-table
              @changeState="
                () => {
                  isMaintainingTableState = false
                }
              "
            ></maintenance-table>
          </template>
          <template v-else>
            <text>拍照打卡：</text>
            <canvas
              id="myCanvas"
              type="2d"
              :style="{
                width: '100%',
                height: 200 + 'px',
                border: '1px solid #ccc',
                position: 'fixed',
                left: '9000px',
              }"
            ></canvas>

            <wd-upload
              custom-class="camera-photo"
              ref="uploader"
              :limit="1"
              accept="media"
              :auto-upload="false"
              :source-type="['camera']"
              :size-type="['compressed']"
              :before-upload="beforeUpload"
              v-if="!hasWatermark"
            ></wd-upload>

            <view v-else style="position: relative">
              <wd-img :src="watermarkImg.path" custom-class="watermark-img"></wd-img>
              <button @click="handleClearUploadImg" class="btn-upload">X</button>
            </view>

            <text>签名：</text>
            <view class="signature-box" style="width: 100%; height: 500rpx">
              <jp-signature ref="signatureRef"></jp-signature>
            </view>
            <view class="signature-btn-list">
              <button class="btn-clear" @click="clear">清空</button>
              <button class="btn-reset" @click="undo">撤消</button>
              <button class="btn-save" @click="save">保存</button>
            </view>

            <text>备注：(选填)</text>
            <textarea
              name=""
              id=""
              :value="remark"
              placeholder="请输入..."
              class="remark"
            ></textarea>
            <button class="btn-submit" @click="handleSubmit">提交</button>
          </template>
        </view>
        <!-- 	维保状态,1：待维保， 2：已维保 ：3：进行中：4：逾期签到   -->
        <view v-else-if="maintenance.isMaintain === 2"></view>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
import JpSignature from '@/pages-sub/sign-in/components/jp-signature/jp-signature.vue'
import maintenanceTable from '@/pages-sub/sign-in/components/maintenance-table/maintenance-table.vue'

/* API */
import QQMapWX from './qqmap-wx-jssdk'
/* store */
import { useUserStore } from '@/store'
/* service */
import {
  postMaintenanceDetail,
  postMaintenanceSignature,
  postMaintenanceSignIn,
} from '@/service/maintenance/maintenance'
import { IElevatorInfo, IMaintenanceBasis } from '@/service/maintenance/type'
/* utils */
import { isNullOrUndefined, px2rpx, uniShowToast } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
import { UploadBeforeUploadOption } from 'wot-design-uni/components/wd-upload/types'
import dayjs from 'dayjs'
import { maintenanceImgUploadApi } from '@/common/api'

// 导航栏
function handleClickBack() {
  uni.navigateBack()
}

const liftInfo = ref<Partial<IElevatorInfo>>({
  longitude: 0,
  latitude: 0,
})

const maintenance = ref<Partial<IMaintenanceBasis>>({
  maintType: '',
  id: null,
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

const type = ref('table')

// 正在维保-表格状态
const isMaintainingTableState = ref(true)

const signatureRef = ref<InstanceType<typeof JpSignature> | null>(null)
const signatureValue = ref()

const remark = ref('')

const save = () => {
  return new Promise((resolve, reject) => {
    signatureRef.value?.canvasToTempFilePath({
      success: (res: { isEmpty: boolean; tempFilePath: string }) => {
        signatureValue.value = res.tempFilePath
        resolve(res)
        console.log('res :>> ', res)
      },
    })
  })
}

const clear = () => {
  signatureRef.value?.clear()
}

const undo = () => {
  signatureRef.value?.undo()
}

const qqmapsdk = new QQMapWX({
  key: 'ND2BZ-7BL3U-6JKV7-GSGY3-QBI57-VHF7R',
})

/* 地理位置 */
const currentPosition = ref({
  longitude: 0,
  latitude: 0,
  address: '',
})

// 定位距离
const signInDistance = ref(999)

onLoad((options) => {
  // 获取维保电梯详情
  getMaintenanceDetail(+options.id)
})

// 获取维保详情
const getMaintenanceDetail = (id: number) => {
  postMaintenanceDetail({ id })
    .then((result) => {
      liftInfo.value = result.ele
      maintenance.value = result.basis
      getSetting()
    })
    .catch((err) => {
      console.log('postMaintenanceDetail err:>> ', err)
    })
}

// 定义一个名为 getSetting 的函数，用于获取设置信息,进而获取地址
function getSetting() {
  wx.getSetting({
    success(res) {
      // 1. 用户未授权，判断是否开启手机定位
      if (!res.authSetting['scope.userLocation']) {
        wx.authorize({
          scope: 'scope.userLocation',
          // 1.1 用户同意授权
          success() {
            getLocation()
          },
          // 1.2 用户拒绝授权
          fail() {
            wx.showToast({
              title: '需要开启定位权限',
              icon: 'none',
            })
          },
        })
      } else {
        // 2. 用户已授权，直接调用wx.getLocation
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
    // 1. 获取定位成功
    success(res) {
      currentPosition.value.longitude = res.longitude // 经度
      currentPosition.value.latitude = res.latitude // 纬度
      console.log('维度、经度 :>> ', res.latitude, res.longitude)
      // 1.2 计算签到距离
      calculateDistance()
      // 1.3 获取街道地址
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
  const from = `${currentPosition.value.latitude},${currentPosition.value.longitude}`
  const to = `${liftInfo.value.latitude},${liftInfo.value.longitude}`

  qqmapsdk.calculateDistance({
    from,
    to,
    mode: 'straight', // 计算直线距离
    success: (res) => {
      signInDistance.value = res.result.elements[0].distance
      console.log('距离签到位置 :>> ', signInDistance.value)
    },
    fail: (err) => {
      console.error('计算距离失败', err)
    },
  })
}

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
  const distance = signInDistance.value
  if (distance > 500) {
    uni.showToast({
      title: '距离签到位置太远',
      icon: 'none',
    })
    return
  }

  postMaintenanceSignIn({ id: maintenance.value.id, is_qan: maintenance.value.iden })
    .then((result) => {
      uni.showToast({
        title: '签到成功',
        icon: 'none',
      })
      maintenance.value.isMaintain = 3
    })
    .catch((err) => {
      console.log('postSignIn err:>> ', err)
    })
}

const hasWatermark = ref(false)

// Canvas
// TODO:
const canvas = reactive({
  self: null,
  ctx: null,
})

// 水印图宽高
// TODO:
const watermarkImg = reactive({
  path: null,
})

// 上传图片
// TODO:
const uploadImg = reactive({
  self: null,
})

// 定义一个名为 takePhoto 的函数，用于拍照操作
function beforeUpload(event: UploadBeforeUploadOption) {
  uploadImg.self = event.files[0]
  console.log('event :>> ', event, uploadImg.self)
  drawCanvas()
}

const drawCanvas = () => {
  // 绘制
  const query = wx.createSelectorQuery()
  query
    .select('#myCanvas')
    .fields({ node: true, size: true }, (res) => {
      console.log('res :>> ', res)
      const canvas = res.node
      const ctx = canvas.getContext('2d')

      const img = canvas.createImage()
      img.onload = () => {
        // 图像加载完成后的回调函数
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        ctx.save()

        ctx.fillStyle = 'rgba(255, 255, 255, .5)' // 半透明白色
        ctx.fillRect(0, 110, res.width, 50)
        ctx.save()

        // 绘制时间、地点
        ctx.font = '14px Arial'
        ctx.fillStyle = 'black'

        setTimeout(() => {
          const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
          ctx.fillText(currentTime, 5, 125)
          ctx.save()

          const currentAddress = currentPosition.value.address
          ctx.fillText(currentAddress, 5, 140)

          ctx.restore()
          ctx.restore()
          ctx.restore()
        }, 400)

        setTimeout(() => {
          // 在绘制完成后将 Canvas 生成图片
          wx.canvasToTempFilePath({
            canvas,
            success: function (res) {
              console.log('canvasToTempFilePath', res)
              // 在这里你可以使用生成的图片，例如预览或上传
              watermarkImg.path = res.tempFilePath
            },
          })
          hasWatermark.value = true
        }, 400)
      }
      img.src = uploadImg.self.path // 设置图像路径
    })
    .exec()
}

// 删除上传图片
const handleClearUploadImg = () => {
  hasWatermark.value = false
}

function uploadImage(filePath: string) {
  const userStore = useUserStore()
  const { token } = userStore.userInfo as unknown as IUserInfo

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: import.meta.env.VITE_SERVER_BASEURL + maintenanceImgUploadApi,
      filePath,
      name: 'image',
      header: {
        token,
      },
      success: function (res) {
        if (res.statusCode === 256) {
          resolve(res.data)
        } else {
          reject(new Error(`上传文件失败，状态码：${res.statusCode}`))
        }
      },
      fail: function (err) {
        console.error('上传文件失败', err)
        reject(err)
      },
    })
  })
}

function getImgUrl(str) {
  const regex = /"imgUrl":"(.*?)"/
  const match = str.match(regex)
  return match ? match[1] : null
}

// 上传提交信息
const handleSubmit = async () => {
  if (isNullOrUndefined(watermarkImg.path)) {
    watermarkImg.path = null
    return uniShowToast('请上传图片')
  }
  if (isNullOrUndefined(signatureValue.value)) {
    const saveRes = (await save()) as { isEmpty: boolean }
    if (saveRes.isEmpty) {
      signatureValue.value = null
      return uniShowToast('请签名')
    }
  }
  console.log('object :>> ', watermarkImg.path, signatureValue.value)
  const watermarkImgRes = await uploadImage(watermarkImg.path)
  const signatureImgRes = await uploadImage(signatureValue.value)
  postMaintenanceSignature({
    id: maintenance.value.id,
    type: 2,
    image: getImgUrl(signatureImgRes),
    clockin_img: getImgUrl(watermarkImgRes),
    remark: remark.value,
  })
    .then((res) => {
      console.log('postMaintenanceSignature res :>> ', res)
    })
    .catch((err) => {
      console.log('postMaintenanceSignature err :>> ', err)
    })

  console.log('signatureValue :>> ', signatureValue.value)
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

    // 未签到
    .sign-in {
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

      .online {
        // background: lightgrey;
      }

      .offline {
        color: $color-white;
        background: lightgray;
      }
    }

    // 已签到
    .clock-in {
      @extend %flex-column;
      gap: $rpx-10;
      padding-bottom: $rpx-32;

      :deep(.wd-upload) {
        --wot-upload-size: 100%;
        width: 100%;
      }
    }

    // 进行中
    .clock-in {
      @extend %flex-column;
      gap: $rpx-10;
      padding-bottom: $rpx-32;

      :deep(.wd-upload) {
        --wot-upload-size: 100%;
        width: 100%;
        aspect-ratio: 3 / 2;

        .wd-upload__mask {
          background: transparent;
        }
      }

      :deep(.watermark-img) {
        width: 100%;
        aspect-ratio: 3/2;
      }

      .btn-upload {
        position: absolute;
        top: -$rpx-20;
        right: -$rpx-20;
        width: $rpx-40;
        height: $rpx-40;
        color: $color-black;
        border-radius: 50%;
        @extend %flex-center;
      }

      .signature-box {
        @extend %flex-center;
        width: 100%;
        height: 100%;
        aspect-ratio: 1 / 1;
        border-radius: $rpx-10;
      }

      .signature-box {
        @extend %flex-center;
        width: 100%;
        height: 100%;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        background: $color-white;
        border: $rpx-1 solid $color-primary;
        border-radius: $rpx-10;

        .signature-canvas {
          width: 100%;
          height: 100%;
        }
      }

      .btn-camera {
        color: $color-white;
        background: $color-primary;
      }

      .signature-btn-list {
        @extend %flex-center;
        gap: $rpx-10;
        margin-top: $rpx-10;

        %signature-btn {
          flex: 1;
          height: $rpx-40;
          color: $color-white;
          border-radius: $rpx-6;
          @extend %flex-center;
          @extend %font-size-lg;
          @extend %btn-reset;
        }

        .btn-clear {
          @extend %signature-btn;
          background: red;
        }

        .btn-reset {
          @extend %signature-btn;
          background: $color-secondary;
        }

        .btn-save {
          @extend %signature-btn;
          background: $color-primary;
        }
      }

      .remark {
        width: 100%;
        padding: $rpx-10;
        border: $rpx-1 solid $color-primary;
        border-radius: $rpx-10;
      }

      .btn-submit {
        color: $color-white;
        background: $color-primary;
      }
    }

    // 已完成
  }
}
</style>
