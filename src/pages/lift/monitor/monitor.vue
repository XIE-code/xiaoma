<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleview: '电梯监控',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="navigation">
      <wd-icon
        name="arrow-left"
        @click="handleClickBack"
        :size="px2rpx(24)"
        color="white"
      ></wd-icon>
      <view class="title">电梯监控</view>
    </view>

    <view class="content">
      <view class="scroll-box">
        <view class="state">在线</view>
        <view class="header">
          <view class="img"></view>
          <view class="head-info">
            <view class="head-info-top">
              <text class="info-name">{{ liftInfo.name }}</text>
              <text class="info-project">项目:</text>
              <text class="info-code">编号: {{ liftInfo.elevatorNumber }}</text>
            </view>
            <view class="info-decoration"></view>
            <view class="run-bar">
              <view class="run-bar-item" v-for="item in showInfo" :key="item.icon">
                <view class="run-bar-img">{{ item.icon }}</view>
                <view class="run-bar-data">{{ item.num }}</view>
                <view class="run-bar-txt">{{ item.text }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="btn-list">
          <button
            :class="`btn-item ${showBtnContent === item.type ? 'active' : ''}`"
            v-for="item in btnList"
            :key="item.type"
            @click="handleClickBtn(item)"
          >
            {{ item.name }}
          </button>
        </view>

        <wd-cell-group v-if="showBtnContent === 'info'" border>
          <wd-cell :title="value" :value="liftInfo[key]" v-for="(value, key) in lift" :key="key" />
        </wd-cell-group>

        <wd-cell-group v-if="showBtnContent === 'run'" border>
          <wd-cell :title="value" :value="runInfo[key]" v-for="(value, key) in run" :key="key" />
        </wd-cell-group>

        <wd-table
          v-if="showBtnContent === 'maintenance'"
          border
          :data="maintenanceList"
          height="400"
        >
          <wd-table-col prop="time" label="维保时间"></wd-table-col>
          <wd-table-col prop="state" label="维保状态"></wd-table-col>
        </wd-table>

        <wd-table v-if="showBtnContent === 'breakdown'" border :data="errorList" height="400">
          <wd-table-col prop="startTime" label="开始时间"></wd-table-col>
          <wd-table-col prop="errorDescription" label="故障描述"></wd-table-col>
          <wd-table-col prop="errorCode" label="故障码"></wd-table-col>
          <wd-table-col prop="state" label="状态"></wd-table-col>
        </wd-table>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* API */
import mqtt from 'mqtt/dist/mqtt'
/* TODO: scrollBox */
import scrollBox from '@/layouts/scroll-box.vue'
/* service */
import { postLiftOneInfo } from '@/service/lift/lift'
import { ILiftOneInfoResponse } from '@/service/lift/type'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'

// 导航栏
function handleClickBack() {
  uni.navigateBack()
}

const showInfo = ref([
  {
    icon: '--',
    num: '000',
    text: '运行次数',
  },
  {
    icon: '--',
    num: '000',
    text: '运行时间',
  },
  {
    icon: '--',
    num: '000',
    text: '运行距离',
  },
])

const status = ref({
  tid: 'req00000000001',
  status: 'running',
  stage: 'start',
  direction: 'down',
  floor: 6,
  floorStart: 5,
  floorEnd: 10,
  distance: 500,
  maxSpeed: 2.5,
  gmt: 1672502400000,
  doorTimes: 15,
  runningUpTimes: 10,
  runningDownTimes: 10,
})

// TODO: 项目
const lift = ref({
  name: '电梯名称',
  type: '电梯型号',
  brand: '电梯品牌',
  model: '电梯型号',
  tid: '电梯梯钟',
  address: '电梯地址',
  company: '使用单位',
  maintenanceCompany: '维保企业',
  maintenancePerson: '维保人员',
})

const liftInfo = ref({
  name: '',
  elevatorNumber: '',
})

const run = {
  status: '电梯状态',
  floor: '当前楼层：',
  direction: '运行方向',
  speed: '速度',
  floorStart: '开始楼层',
  floorEnd: '结束楼层',
  runningDownTimes: '已运行的楼层次数',
  maxSpeed: '最大速度',
  doorTimes: '门操作次数：',
}
const runInfo = ref({})

const maintenanceList = ref([
  // {
  //   time: '',
  //   state: '',
  // },
])

const errorList = ref([
  // {
  //   startTime: '',
  //   errorDescription: '',
  //   errorCode: '',
  //   state: '',
  // },
])

const getLiftInfo = (key: string) => {
  console.log('liftInfo :>> ', key, liftInfo.value)
  return liftInfo.value[key]
}

onLoad((options) => {
  const elevatorId = options.elevatorId
  postLiftOneInfo({ elevator_id: elevatorId, is_archives: 1 })
    .then((result) => {
      liftInfo.value = result
    })
    .catch((err) => {
      console.log('postLiftGetRun err:>> ', err)
    })
})

type maintenanceBtnType = 'info' | 'run' | 'maintenance' | 'breakdown'
const showBtnContent = ref<maintenanceBtnType>('info')
type btnType = {
  name: string
  type: maintenanceBtnType
}

enum maintenanceBtnEnum {
  info = 'info',
  run = 'run',
  maintenance = 'maintenance',
  breakdown = 'breakdown',
}

const btnList = ref<btnType[]>([
  {
    name: '电梯信息',
    type: maintenanceBtnEnum.info,
  },
  {
    name: '运行统计',
    type: maintenanceBtnEnum.run,
  },
  {
    name: '维保记录',
    type: maintenanceBtnEnum.maintenance,
  },
  {
    name: '故障记录',
    type: maintenanceBtnEnum.breakdown,
  },
])

const handleClickBtn = (item: any) => {
  showBtnContent.value = item.type
  console.log('showBtnContent :>> ', showBtnContent.value)
}

let client: mqtt.MqttClient | null = null

const connectToMQTT = () => {
  // 连接配置
  const options: mqtt.IClientOptions = {
    username: import.meta.env.VITE_MQTT_USERNAME,
    password: import.meta.env.VITE_MQTT_PASSWORD,
    clientId: 'vue_mqtt_client_' + Math.random().toString(16).substr(2, 8),
  }

  // 创建MQTT客户端
  // #ifdef H5
  client = mqtt.connect(import.meta.env.VITE_MQTT_URL, options)
  // #endififdef

  // #ifdef MP-WEIXIN
  client = mqtt.connect('wxs://sharemarttech.com:8084/mqtt', options)
  // #endif

  // 连接成功时的回调
  client.on('connect', () => {
    console.log('连接成功')
    // 主题 :status/特种设备号
    client.subscribe('status/31104413002013120268', (err) => {
      if (err) {
        console.error('订阅失败', err)
      } else {
        console.log('订阅成功')
      }
    })
  })

  // 接收到消息时的回调
  client.on('message', (topic, message) => {
    if (topic === 'status/31104413002013120268') {
      try {
        // 解析 JSON 数据
        status.value = JSON.parse(message.toString())
        console.log('接收到消息:', status.value)
      } catch (error) {
        console.error('解析消息失败:', error)
      }
    }
  })

  // 错误处理
  client.on('error', (err) => {
    console.error('MQTT 错误:', err)
  })

  // 连接失败的回调
  client.on('close', () => {
    console.log('连接关闭')
  })
}

// onMounted(() => {
//   connectToMQTT()
// })

onBeforeUnmount(() => {
  if (client) {
    client.end()
  }
})
</script>

<style lang="scss" scoped>
$rpx-17: px2rpx(17);
$rpx-60: px2rpx(60);

%font-size-12 {
  @extend %font-size-xs;
  color: $color-black;
}

// 导航栏
.navigation {
  @extend %flex-center;
  flex-shrink: 0;
  gap: $rpx-16;
  justify-content: flex-start;
  height: $rpx-32;
  padding: 0 $rpx-24;
  background: $color-secondary;

  .title {
    @extend %font-size-xl;
    @extend %flex-center;
    line-height: $rpx-28;
    color: $color-white;
  }
}
// 内容
.content {
  flex-grow: 1;
  margin-top: $rpx-10;
  overflow: scroll;
  background: #f8f9fa;
  border-radius: $rpx-30;
  .scroll-box {
    @extend %flex-column;
    position: relative;
    gap: $rpx-12;
    padding: $rpx-16 $rpx-24;

    .state {
      position: absolute;
      top: 0;
      right: $rpx-1;
      padding: $rpx-4 $rpx-20 $rpx-4 $rpx-20;
      color: $color-white;
      background: $color-primary;
      border-radius: 0 0 0 $rpx-30;
      @extend %font-size-sm;
    }

    .header {
      @extend %flex-center;
      gap: $rpx-6;
      justify-content: space-between;
      height: 30vh;

      .img {
        flex: 1;
        height: 100%;
        border: $rpx-1 solid $color-primary;
      }

      .head-info {
        @extend %flex-column;
        flex: 2;
        gap: $rpx-6;
        justify-content: space-between;
        height: 100%;
        // border: $rpx-1 solid $color-primary;

        .head-info-top {
          @extend %flex-column;
          gap: $rpx-6;

          .info-name {
            @extend %font-size-lg;
            font: bold;
          }

          .info-project,
          .info-code {
            @extend %font-size;
          }
        }

        .info-decoration {
          width: 100%;
          height: $rpx-32;
          background: whitesmoke;
        }

        .run-bar {
          @extend %flex-center;
          gap: $rpx-6;

          .run-bar-item {
            @extend %flex-column;
            gap: $rpx-6;
            width: 100%;
            height: 100%;
            border: $rpx-1 solid $color-primary;

            .run-bar-img {
              @extend %font-size;
            }

            .run-bar-data {
              @extend %font-size-lg;
            }

            .run-bar-view {
              @extend %font-size-xl;
            }
          }
        }
      }
    }

    .btn-list {
      @extend %flex-center;
      gap: $rpx-12;

      .btn-item {
        padding: $rpx-3 $rpx-6;
        @extend %font-size-base;
      }

      .active {
        border: $rpx-1 $color-primary solid;
      }
    }
  }
}
</style>
