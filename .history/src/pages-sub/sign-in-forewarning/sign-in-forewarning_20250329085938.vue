<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '急修打卡',
  },
}
</route>

<template>
  <!-- 急修打卡区域 -->
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY" @click="blurSignature">
    <view class="header">
      <view class="header-nav">
        <wd-icon
          name="arrow-left"
          @click="handleClickBack"
          :size="px2rpx(24)"
          color="white"
        ></wd-icon>
        <view class="title">急修打卡</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="scroll-box">
      <view class="container">
        <view>电梯地址： {{ liftInfo.address }}</view>
        <view>电梯名称： {{ liftInfo.name }}</view>
        <view>故障描述： {{ repairInfo.faultSyn }}</view>
        <view v-if="[4, 5, 7].includes(repairInfo.repairType)">
          急修状态： {{ state === 4 ? '维修完成' : state === 5 ? '确定误报' : '未完成' }}
        </view>
        <!-- 急修状态展示 -->
        <template v-if="repairInfo.repairType === 3">
          <view class="flex-row">
            <view class="repair-state">急修状态：</view>
            <wd-radio-group checked-color="rgb(83, 157, 243)" shape="dot" v-model="state" inline>
              <wd-radio :value="4">维修完成</wd-radio>
              <wd-radio :value="5">确定误报</wd-radio>
              <wd-radio :value="7">未完成</wd-radio>
            </wd-radio-group>
          </view>
          <view class="flex-row">
            <view class="width-100">急修建议：</view>
            <wd-radio-group
              checked-color="rgb(83, 157, 243)"
              shape="dot"
              v-model="suggestion"
              inline
            >
              <wd-radio :value="1">停梯</wd-radio>
              <wd-radio :value="2">运行</wd-radio>
            </wd-radio-group>
          </view>
          <view class="flex-row">
            <view class="width-100">更换零件：</view>
            <wd-radio-group
              checked-color="rgb(83, 157, 243)"
              shape="dot"
              v-model="isReplace"
              inline
            >
              <wd-radio :value="0">未更换</wd-radio>
              <wd-radio :value="1">更换</wd-radio>
            </wd-radio-group>
          </view>
          <view>
            <text>备注：</text>
            <textarea
              name=""
              id=""
              :value="remark"
              placeholder="请输入..."
              class="remark"
            ></textarea>
          </view>
        </template>
        <!-- 签到区域 -->
        <!-- <view v-if="repairInfo.repairType === 3" class="sign-in"> -->
        <view v-if="repairInfo.repairType === 1" class="sign-in">
          <button
            hover-class="button-hover"
            :style="
              signInDistance <= 500
                ? 'background-color: #87cefa; color: white'
                : 'background-color: lightgray; color: white'
            "
            @click="handleSignIn"
            :class="`btn-sign ${signInDistance <= 500 ? 'online' : 'offline'}`"
          >
            {{ `${signInDistance <= 500 ? '点击签到' : '距离过远'}` }}
          </button>
          <view>当前位置： {{ currentPosition.address }}</view>
        </view>
        <!-- 打卡区域 -->
        <!-- <view v-else-if="repairInfo.repairType === 1" class="clock-in"> -->
        <view v-else-if="repairInfo.repairType === 3" class="clock-in">
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

          <!-- 签名区域 -->
          <text>签名：</text>
          <view
            class="signature-box"
            @click.stop="focusSignature"
            style="width: 100%; height: 500rpx; border: 2px solid #4a90e2"
          >
            <jp-signature
              ref="signatureRef"
              :style="{
                width: '100%',
                height: '450rpx',
                border: `2px solid ${isSignatureFocused ? '#4a90e2' : '#cccccc'}`,
                borderRadius: '10rpx',
                backgroundColor: '#f5f5f5',
              }"
            ></jp-signature>
          </view>
          <view class="signature-btn-list">
            <button class="btn-clear" @click="clear">清空</button>
            <button class="btn-reset" @click="undo">撤消</button>
            <button class="btn-save" @click="save">保存</button>
          </view>

          <button class="btn-submit" @click="handleSubmit">提交</button>
        </view>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* 组件、API、存储、服务、工具、常量等的导入 */
/* components */
import wrapper from '@/layouts/wrapper.vue'
import JpSignature from '@/pages-sub/sign-in/components/jp-signature/jp-signature.vue'
/* API */
import QQMapWX from '../sign-in/qqmap-wx-jssdk'
/* store */
import { useUserStore } from '@/store'
/* service */
import { IElevatorInfo } from '@/service/maintenance/type'
/* utils */
import { isNullOrUndefined, px2rpx, uniShowToast } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
import { UploadBeforeUploadOption } from 'wot-design-uni/components/wd-upload/types'
import dayjs from 'dayjs'
import { maintenanceImgUploadApi } from '@/common/api'
import { http } from '@/utils/http'

// 导航栏返回按钮点击事件
function handleClickBack() {
  uni.navigateBack()
}

// 急修信息相关数据
const id = ref(null)
const state = ref(4)
const suggestion = ref(2)
const isReplace = ref(1)
const remark = ref('')

// 地图服务初始化
const qqmapsdk = new QQMapWX({
  key: 'ND2BZ-7BL3U-6JKV7-GSGY3-QBI57-VHF7R',
})

// 电梯信息和维修信息
const repairInfo = ref({})
const liftInfo = ref<Partial<IElevatorInfo>>({
  longitude: 0,
  latitude: 0,
})

// 签名区域聚焦状态
const isSignatureFocused = ref(false)
// 点击签名区域触发状态
const focusSignature = () => {
  isSignatureFocused.value = true
}
// 点击页面其他区域时会失去焦点
const blurSignature = () => {
  isSignatureFocused.value = false
}

// 保存签名
const maintenance = ref({
  maintType: '',
  id: null,
})

// 签名相关
const signatureRef = ref<InstanceType<typeof JpSignature> | null>(null)
const signatureValue = ref()
// 保存签名
const save = () => {
  return new Promise((resolve, reject) => {
    if (!signatureRef.value) {
      uniShowToast('请先签名')
      reject(new Error('请先签名'))
      return
    }
    signatureRef.value.canvasToTempFilePath({
      success: (res) => {
        signatureValue.value = res.tempFilePath
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  }).finally(() => {
    isSignatureFocused.value = false // 保存后取消聚焦状态
  })
}

// 清空签名
const clear = () => {
  if (signatureRef.value) {
    signatureRef.value.clear()
    isSignatureFocused.value = false // 清空后取消聚焦状态
  }
}

// 撤销签名
const undo = () => {
  if (signatureRef.value) {
    signatureRef.value.undo()
  }
}

// 获取电梯维修状态,0:待审核;1待接警;2:待处理;3:到达现场处理中;4:维修完成;5误报确认;6自动修复
const getMaintenanceType = (type: number) => {
  const stateList = [
    '待审核',
    '待接警',
    '待处理',
    '到达现场处理中',
    '维修完成',
    '误报确认',
    '自动修复',
  ]
  return stateList[type]
}

/* 地理位置 */
const currentPosition = ref({
  longitude: 0,
  latitude: 0,
  address: '',
})

// 定位距离
const signInDistance = ref(999)

// 获取急修详情
const getForeWarningDetail = (id: number) => {
  http.post('/maint/fault_one', { id }).then((res) => {
    repairInfo.value = res.repair
    liftInfo.value = res.ele
    getSetting()
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

// 获取用户定位当前位置
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

// 点击签到按钮
function handleSignIn() {
  const distance = signInDistance.value
  if (distance > 500) {
    uni.showToast({
      title: '距离签到位置太远',
      icon: 'none',
    })
    return
  }

  setPostMaintenanceSignIn()
}

// 提交签到信息
const setPostMaintenanceSignIn = () => {
  http
    .post('/maint/fault_submit', { id: id.value, type: 3, content: '' })
    .then((res) => {
      uni.showToast({
        title: '签到成功',
        icon: 'none',
      })
      repairInfo.value.repairType = 3
      getSetting()
    })
    .catch((err) => {
      console.log('postSignIn err:>> ', err)
    })
}

// 拍照相关
const hasWatermark = ref(false)
// Canvas
const canvas = reactive({
  self: null,
  ctx: null,
})

// 水印图宽高
const watermarkImg = reactive({
  path: null,
})

// 上传图片
const uploadImg = reactive({
  self: null,
})

// 定义一个名为 takePhoto 的函数，用于拍照操作，拍照前处理
function beforeUpload(event: UploadBeforeUploadOption) {
  uploadImg.self = event.files[0]
  console.log('event :>> ', event, uploadImg.self)
  drawCanvas()
}

// 绘制水印
const drawCanvas = () => {
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
// 提取图片URL
function getImgUrl(str) {
  const regex = /"imgUrl":"(.*?)"/
  const match = str.match(regex)
  return match ? match[1] : null
}

// 上传提交信息
const handleSubmit = async () => {
  if (state.value === 7 && remark.value === '') {
    return uniShowToast('急修未完成，请填写备注')
  }

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

  const watermarkImgRes = await uploadImage(watermarkImg.path)
  const signatureImgRes = await uploadImage(signatureValue.value)
  http
    .post('/maint/fault_submit', {
      id: id.value,
      type: state.value,
      image: getImgUrl(signatureImgRes),
      clockin_img: getImgUrl(watermarkImgRes),
      suggestion: suggestion.value,
      is_replace: isReplace.value,
      remark: remark.value,
      content: remark.value,
    })
    .then((res) => {
      console.log('fault_submit res :>> ', res)
      repairInfo.value.repairType = state.value
    })
    .catch((err) => {
      console.log('fault_submit err :>> ', err)
    })
}

onLoad((options) => {
  id.value = +options.id
})

onShow(() => {
  getForeWarningDetail(+id.value)
})
</script>

<style lang="scss" scoped>
$rpx-11: px2rpx(11);
$rpx-17: px2rpx(17);
$rpx-120: px2rpx(120);
$rpx-100: px2rpx(100);
$rpx-45: px2rpx(45);

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

    :deep(.wd-radio) {
      .check-radio {
        background-color: $color-primary;
        border-color: $color-primary;
      }
    }
    .flex-row {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      .repair-state {
        @extend %flex-center;
        flex-shrink: 0;
        justify-content: flex-start;
        width: $rpx-100;
      }
      .state-group {
        flex-grow: 1;
      }
    }

    .width-100 {
      width: $rpx-100;
    }

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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        aspect-ratio: 1 / 1;
        cursor: pointer;
        border-radius: $rpx-10;
        transition: all 0.3s ease;
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

      .btn-submit {
        color: $color-white;
        background: $color-primary;
      }
    }

    .remark {
      width: 100%;
      padding: $rpx-10;
      margin-top: $rpx-10;
      border: $rpx-1 solid $color-primary;
      border-radius: $rpx-10;
    }
  }
}
</style>
