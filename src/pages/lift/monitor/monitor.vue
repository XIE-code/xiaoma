<template>
  <view>
    <text style="display: block; margin-top: 20px; text-align: center">电梯状态实时监测</text>
    <view v-if="status">
      <text>
        <strong>电梯状态：</strong>
        {{ status.status }}
      </text>
      <text>
        <strong>当前楼层：</strong>
        {{ status.floor }}
      </text>
      <text>
        <strong>运行方向：</strong>
        {{ status.direction }}
      </text>
      <text>
        <strong>速度：</strong>
        {{ status.maxSpeed }} m/s
      </text>
      <text>
        <strong>开始楼层：</strong>
        {{ status.floorStart }}
      </text>
      <text>
        <strong>结束楼层：</strong>
        {{ status.floorEnd }}
      </text>
      <text>
        <strong>已运行的楼层次数：</strong>
        {{ status.runningDownTimes }} 次
      </text>
      <text>
        <strong>最大速度：</strong>
        {{ status.maxSpeed }} m/s
      </text>
      <text>
        <strong>门操作次数：</strong>
        {{ status.doorTimes }} 次
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import mqtt from 'mqtt'

const status = ref(null)
let client: mqtt.MqttClient | null = null

const connectToMQTT = () => {
  // 连接配置
  const options: mqtt.IClientOptions = {
    username: 'admin',
    password: 'admin',
    clientId: 'vue_mqtt_client_' + Math.random().toString(16).substr(2, 8),
  }

  // 创建MQTT客户端
  client = mqtt.connect('wss://sharemarttech.com:8084/mqtt', options)

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

onMounted(() => {
  connectToMQTT()
})

onBeforeUnmount(() => {
  if (client) {
    client.end()
  }
})
</script>

<style scoped>
text {
  display: block;
  margin-bottom: 10px;
}
</style>
