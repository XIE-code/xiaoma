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
          <view class="img">
            <wd-img width="100%" height="100%" :src="liftJpg" />
            <view class="img-floor-num">
              <text ref="imgFloor" class="img-floor-text">{{ getRealFloor(runInfo.floor) }}</text>
            </view>
          </view>
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
                <view class="run-bar-data">
                  {{ item.type === 'time' ? '0' : getRunInfo(item.type) }}
                </view>
                <view class="run-bar-txt">{{ item.text }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="btn-list">
          <wd-button
            size="small"
            :type="`${showBtnContent === item.type ? 'default' : 'info'}`"
            :class="`${showBtnContent === item.type ? 'active' : ''}`"
            v-for="item in btnList"
            :key="item.type"
            @click="handleClickBtn(item)"
            plain
          >
            {{ item.name }}
          </wd-button>
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
            v-for="(value, key) in runInfoText"
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
/* service */
import { postGetLiftFloor, postLiftOneInfo } from '@/pages-sub/service/lift/lift'
import { ILiftOneInfoResponse } from '@/pages-sub/service/lift/type'
/* utils */
import { px2rpx } from '@/utils/tools'
/* constant */
import { COLOR_SECONDARY } from '@/common/constant'
import {
  btnListData,
  btnType,
  maintenanceBtnEnum,
  maintenanceBtnType,
  monitorInfo,
  runInfoText,
  runInfoData,
  showInfo,
} from './monitor-info'
// img
import liftJpg from '@/pages-sub/static/lift.jpg'

// 导航栏
function handleClickBack() {
  uni.navigateBack()
}

// TODO: 项目
const lift = ref(monitorInfo)

const liftInfo = ref<Partial<ILiftOneInfoResponse>>({
  name: null,
  elevatorNumber: null,
})

const runInfo = ref(runInfoData)

const floorList = ref([])

const getRealFloor = (floor: number) => {
  if (floor === null) return ''
  return floorList.value.length !== 0 ? floorList.value[floor] : floor + 1
}

const getRunInfo = (key: string) => {
  const runInfoValue = runInfo.value

  const handlers = new Map<string, (value: any) => any>([
    ['status', (value) => (value === 'running' ? '运行' : value === 'stop' ? '停止' : '')],
    [
      'direction',
      (value) =>
        value === 'open' ? '开门' : value === 'up' ? '上行' : value === 'down' ? '下行' : '',
    ],
    ['floor', (value) => getRealFloor(value)],
    ['distance', (value) => (value ? value.toFixed(2) + 'm' : '0m')],
    [
      'maxSpeed',
      (value) => {
        return value ? value.toFixed(2) + 'm/s' : '0m/s'
      },
    ],
    ['gmt', (value) => (value ? new Date(value).toLocaleString() : '')],
  ])

  const handler = handlers.get(key)
  return handler ? handler(runInfoValue[key]) : runInfoValue[key]
}

const maintenanceList = ref([])

const errorList = ref([])

const showBtnContent = ref<maintenanceBtnType>(maintenanceBtnEnum.info)

const btnList = ref<btnType[]>(btnListData)

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

onLoad((options) => {
  const elevatorId = options.elevatorId

  postLiftOneInfo({ elevator_id: elevatorId, is_archives: 1 })
    .then((result) => {
      liftInfo.value = result
      postGetLiftFloor({ id: elevatorId, ele_unmber: liftInfo.value.elevatorNumber }).then(
        (result) => {
          floorList.value = result.list.map((item) => item.actualFloor)
          connectToMQTT()
        },
      )
    })
    .catch((err) => {
      console.log('postLiftOneInfo err:>> ', err)
    })
})

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
        position: relative;
        flex: 1;
        height: 100%;

        .img-floor-num {
          position: absolute;
          top: $rpx-5;
          left: 50%;
          transform: translateX(calc(-50%));

          .img-floor-text {
            position: relative;
            font-size: $rpx-10;

            color: red;
            transition: all 1.3s;
          }
        }
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
