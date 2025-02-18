<template>
  <view class="canvas">
    <view class="canvas_header">手写签名</view>
    <view class="canvas_canvas">
      <canvas canvas-id="myCanvas" style="width: 350px; height: 400px"></canvas>
    </view>
    <view class="canvas_info">
      <text @click="showColorDiv">*请在输入框写入您的姓名</text>
    </view>
    <view class="canvas_footer">
      <view @click="clearArea" class="canvas_footer_re">重写</view>
      <view @click="saveImage" class="canvas_footer_sa">保存</view>
      <view @click="saveImageInfo" class="canvas_footer_su">提交</view>
    </view>
    <!-- 颜色选择器 -->
    <view class="canvas_color" v-show="showColor === 2">
      <view>
        <input v-model="strokeStyle" type="color" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const touchPressed = ref(false)
const ctx = ref(null)
const strokeStyle = ref('#000000') // 书写颜色
const lineWidth = ref(4) // 线条宽度
const lastX = ref(null)
const lastY = ref(null)
const canvas = ref(null)
const showColor = ref(1) // 显示颜色
const sColor = ref(0) // 显示颜色

onMounted(() => {
  const query = uni.createSelectorQuery().in(this)
  query
    .select('#myCanvas')
    .boundingClientRect((data) => {
      canvas.value = data
      ctx.value = uni.createCanvasContext('myCanvas', this)
      Init()
    })
    .exec()
})

const Init = () => {
  // 移动前
  uni.onTouchStart((event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      touchPressed.value = true
      draw(touch.clientX - canvas.value.left, touch.clientY - canvas.value.top, false)
    }
  })

  // 移动中
  uni.onTouchMove((event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      if (touchPressed.value) {
        draw(touch.clientX - canvas.value.left, touch.clientY - canvas.value.top, true)
      }
    }
  })

  // 移动结束
  uni.onTouchEnd(() => {
    touchPressed.value = false
  })
}

const draw = (x, y, isDown) => {
  const context = ctx.value
  if (isDown) {
    context.beginPath()
    context.setStrokeStyle(strokeStyle.value)
    context.setLineWidth(lineWidth.value)
    context.setLineJoin('round')
    context.moveTo(lastX.value, lastY.value)
    context.lineTo(x, y)
    context.stroke()
    context.closePath()
  }
  lastX.value = x
  lastY.value = y
}

// 重写
const clearArea = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.value.draw()
}

// 保存本地
const saveImage = () => {
  uni.canvasToTempFilePath(
    {
      canvasId: 'myCanvas',
      success: (res) => {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            uni.showToast({
              title: '保存成功',
              icon: 'success',
            })
          },
        })
      },
    },
    this,
  )
}

// 保存服务器
const saveImageInfo = () => {
  uni.canvasToTempFilePath(
    {
      canvasId: 'myCanvas',
      success: (res) => {
        const base64 = res.tempFilePath
        console.log(base64, 'bbb')
        // 这里可以添加上传到服务器的代码
      },
    },
    this,
  )
}

// 弹出颜色
const showColorDiv = () => {
  // return
  sColor.value += 1
  if (sColor.value === 10) {
    showColor.value = 2
  }
}

// 签完名的图片旋转处理
const rotateBase64Img = (src, edg, callback) => {
  // ...旋转图片的逻辑保持不变
}
</script>

<style>
.canvas_header {
  width: 100%;
  font-size: 20px;
  font-weight: 800;
  line-height: 50px;
  text-align: center;
}
.canvas_canvas {
  width: 350px;
  margin: 0 auto;
  border: 1px solid #aaa;
}
.canvas_info {
  margin: 10px 8%;
  font-size: 12px;
}
.canvas_footer {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 10px 10%;
  font-weight: 800;
  line-height: 40px;
  color: white;
  text-align: center;
}
.canvas_footer_re {
  width: 100px;
  background: #f11919;
  border-radius: 10px;
}
</style>
