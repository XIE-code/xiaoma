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
        <view :class="`state ${liftInfo.isOnline == '1' ? '' : 'offline'}`">
          {{ liftInfo.isOnline == '1' ? '在线' : '离线' }}
        </view>
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
                <wd-icon :name="item.icon" size="22px"></wd-icon>
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
          <wd-cell
            :title="value"
            customClass="custom-info"
            :value="liftInfo[key]"
            v-for="(value, key) in lift"
            :key="key"
          />
        </wd-cell-group>

        <wd-cell-group customClass="custom-run" v-if="showBtnContent === 'run'" border>
          <wd-cell
            :title="value"
            :value="getRunInfo(key)"
            v-for="(value, key) in monitorRunInfo"
            :key="key"
          />
        </wd-cell-group>

        <wd-table
          v-if="showBtnContent === 'maintenance'"
          border
          :data="maintenanceList"
          height="400"
          customClass="custom-maintenance"
        >
          <wd-table-col align="center" width="50%" prop="time" label="维保时间"></wd-table-col>

          <wd-table-col align="center" width="50%" prop="state" label="维保状态"></wd-table-col>
        </wd-table>

        <wd-table v-if="showBtnContent === 'breakdown'" border :data="errorList" height="400">
          <wd-table-col align="center" width="25%" prop="startTime" label="开始时间"></wd-table-col>

          <wd-table-col
            align="center"
            width="25%"
            prop="errorDescription"
            label="故障描述"
          ></wd-table-col>
          <wd-table-col align="center" width="25%" prop="errorCode" label="故障码"></wd-table-col>
          <wd-table-col align="center" width="25%" prop="state" label="状态"></wd-table-col>
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
import { postGetLiftFloor, postLiftOneInfo } from '@/service/lift/lift'
import { IFloorInfo, ILiftOneInfoResponse } from '@/service/lift/type'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
import { monitorInfo, monitorRunInfo } from './monitor-info'

// 导航栏
function handleClickBack() {
  uni.navigateBack()
}

const showInfo = ref([
  {
    icon: 'dashboard',
    num: '0m/s',
    text: '运行速度',
  },
  {
    icon: 'swap-right',
    num: '--m',
    text: '运行距离',
  },
  {
    icon: 'time',
    num: '0',
    text: '运行时间',
  },
])

// TODO: 项目
const lift = ref(monitorInfo)

const liftInfo = ref<Partial<ILiftOneInfoResponse>>({
  name: null,
  elevatorNumber: null,
})

const runObj = {
  tid: '', // 业务识别id
  status: '', // 电梯运行状态 stop/running
  direction: '', // 运行方向 up/down
  floor: null, // 当前楼层
  floorStart: null, // 起始楼层
  floorEnd: null, // 结束楼层
  distance: null, // 运行距离
  maxSpeed: null, // 最大运行速度
  gmt: null, // 状态时间
  doorTimes: null, // 当天累计开关门次数
  runningUpTimes: null, // 当天累计向上运行次数
  runningDownTimes: null, // 当天累计向下运行次数
}

const runInfo = ref(runObj)

const getRunInfo = (key: string) => {
  console.log('runInfo :>> ', key, runInfo.value)
  const runInfoValue = runInfo.value
  const handlers = new Map<string, (value: any) => any>([
    ['floor', (value) => floorMap.get(value)],
    ['floorStart', (value) => floorMap.get(value)],
    ['status', (value) => (value === 'running' ? '运行' : value === 'stop' ? '停止' : '')],
    [
      'direction',
      (value) =>
        value === 'open' ? '开门' : value === 'up' ? '上行' : value === 'down' ? '下行' : '',
    ],
    ['gmt', (value) => new Date(value).toLocaleString()],
  ])

  const handler = handlers.get(key)
  return handler ? handler(runInfoValue[key]) : runInfoValue[key]
}

const maintenanceList = ref([
  {
    time: '',
    state: '',
  },
])

const errorList = ref([
  {
    startTime: '',
    errorDescription: '',
    errorCode: '',
    state: '',
  },
])

type maintenanceBtnType = 'info' | 'run' | 'maintenance' | 'breakdown'
enum maintenanceBtnEnum {
  info = 'info',
  run = 'run',
  maintenance = 'maintenance',
  breakdown = 'breakdown',
}

const showBtnContent = ref<maintenanceBtnType>(maintenanceBtnEnum.info)

type btnType = {
  name: string
  type: maintenanceBtnType
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

let elevatorId = null
const floorMap = new Map<number, number>()

onLoad((options) => {
  elevatorId = options.elevatorId

  postLiftOneInfo({ elevator_id: elevatorId, is_archives: 1 })
    .then((result) => {
      liftInfo.value = result
      postGetLiftFloor({ id: elevatorId, ele_unmber: liftInfo.value.elevatorNumber }).then(
        (result) => {
          result.list.forEach((item: IFloorInfo) => {
            floorMap.set(item.mqttFloor, item.actualFloor)
            console.log('floorMap :>> ', floorMap)
          })
          connectToMQTT()
        },
      )
    })
    .catch((err) => {
      console.log('postLiftOneInfo err:>> ', err)
    })
})

const handleClickBtn = (item: any) => {
  showBtnContent.value = item.type
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
  // #endif

  // #ifdef MP-WEIXIN
  client = mqtt.connect('wxs://sharemarttech.com:8084/mqtt', options)
  // #endif

  const deviceID = `status/${liftInfo.value.registerCode}`
  // 连接成功时的回调
  client.on('connect', () => {
    console.log('连接成功')
    // 主题 :status/特种设备号
    client.subscribe(deviceID, (err) => {
      if (err) {
        console.error('订阅失败', err)
      } else {
        console.log('订阅成功')
      }
    })
  })

  // 接收到消息时的回调
  client.on('message', (topic, message) => {
    if (topic === deviceID) {
      try {
        // 解析 JSON 数据
        runInfo.value = JSON.parse(message.toString())
        const runInfoData = runInfo.value
        showInfo.value[1].num = runInfoData.distance + ''
        // showInfo.value[2].num = new Date(runInfoData.gmt) + ''
        console.log('接收到消息:', runInfo.value)
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

onHide(() => {
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
    gap: $rpx-16;
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

    .offline {
      background-color: rgb(171, 171, 171);
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
            align-items: center;
            width: 100%;
            height: 100%;
            // border: $rpx-1 solid $color-primary;

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

    :deep(.custom-info) {
      .wd-cell__right {
        flex: 2;
      }
    }

    :deep(.custom-run) {
      .wd-cell__left {
        flex: 2;
      }
    }

    :deep(.custom-maintenance) {
      .wd-table__content {
        width: 100%;
      }

      .wd-table-cell {
        flex: 1;
      }
    }
  }
}
</style>
