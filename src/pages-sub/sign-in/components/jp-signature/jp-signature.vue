<template>
  <view class="lime-signature" v-if="show" :style="[canvasStyle, styles]" ref="limeSignature">
    <!-- #ifndef APP-VUE || APP-NVUE -->
    <canvas
      v-if="useCanvas2d"
      class="lime-signature__canvas"
      :id="canvasId"
      type="2d"
      :disableScroll="disableScroll"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    ></canvas>
    <canvas
      v-else
      :disableScroll="disableScroll"
      class="lime-signature__canvas"
      :canvas-id="canvasId"
      :id="canvasId"
      :width="canvasWidth"
      :height="canvasHeight"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      @mousedown="touchStart"
      @mousemove="touchMove"
      @mouseup="touchEnd"
    ></canvas>
    <canvas
      class="offscreen"
      canvas-id="offscreen"
      id="offscreen"
      :style="'width:' + offscreenSize[0] + 'px;height:' + offscreenSize[1] + 'px'"
      :width="offscreenSize[0]"
      :height="offscreenSize[1]"
    ></canvas>
    <view
      v-if="showMask"
      class="mask"
      @touchstart="touchStart"
      @touchmove.stop.prevent="touchMove"
      @touchend="touchEnd"
    ></view>
    <!-- #endif -->
    <!-- #ifdef APP-VUE -->
    <view
      :id="canvasId"
      :disableScroll="disableScroll"
      :rparam="param"
      :change:rparam="sign.update"
      :rclear="rclear"
      :change:rclear="sign.clear"
      :rundo="rundo"
      :rredo="rredo"
      :change:rredo="sign.redo"
      :change:rundo="sign.undo"
      :rsave="rsave"
      :rmask="rmask"
      :change:rsave="sign.save"
      :change:rmask="sign.mask"
      :rdestroy="rdestroy"
      :change:rdestroy="sign.destroy"
      :rempty="rempty"
      :change:rempty="sign.isEmpty"
    ></view>
    <!-- #endif -->
    <!-- #ifdef APP-NVUE -->
    <web-view
      src="/uni_modules/lime-signature/hybrid/html/index.html"
      class="lime-signature__canvas"
      ref="webview"
      @pagefinish="onPageFinish"
      @error="onError"
      @onPostMessage="onMessage"
    ></web-view>
    <!-- #endif -->
  </view>
</template>

<script>
// #ifndef APP-NVUE
import { canIUseCanvas2d, wrapEvent, requestAnimationFrame, sleep, isTransparent } from './utils'
import { Signature } from './signature.js'
// import {Signature} from '@signature';
import { uniContext, createImage, toDataURL } from './context'
// #endif
import props from './props'
import { base64ToPath, getRect } from './utils'

/**
 * LimeSignature 手写板签名
 * @description 手写板签名插件：一款能跑在uniapp各端中的签名插件，支持横屏、背景色、笔画颜色、笔画大小等功能,可生成有内容的区域，减小图片尺寸，节省空间。
 * @property {Number} penSize 画笔大小
 * @property {Number} minLineWidth 线条最小宽
 * @property {Number} maxLineWidth 线条最大宽
 * @property {String} penColor 画笔颜色
 * @property {String} backgroundColor 背景颜色,不填则为透明
 * @property {type} 指定 canvas 类型
 * @value 2d canvas 2d
 * @value '' 非 canvas 2d 旧接口，微信不再维护
 * @property {Boolean} openSmooth 模拟笔锋
 * @property {Number} beforeDelay 延时初始化，在放在弹窗里可以使用 （毫秒）
 * @property {Number} maxHistoryLength 限制历史记录数，即最大可撤销数，传入0则关闭历史记录功能
 * @property {Boolean} landscape 横屏，使用后在最后生成图片时会图片旋转90度
 * @property {Boolean} disableScroll 当在写字时，禁止屏幕滚动以及下拉刷新，nvue无效
 * @property {Boolean} boundingBox 只生成内容区域，即未画部分不生成，有性能的损耗
 */
export default {
  props,
  data() {
    return {
      canvasWidth: null,
      canvasHeight: null,
      offscreenWidth: null,
      offscreenHeight: null,
      useCanvas2d: true,
      show: true,
      offscreenStyles: '',
      showMask: false,
      isPC: false,
      // #ifdef APP-PLUS
      rclear: 0,
      rdestroy: 0,
      rundo: 0,
      rredo: 0,
      rsave: JSON.stringify({
        n: 0,
        fileType: 'png',
        quality: 1,
        destWidth: 0,
        destHeight: 0,
      }),
      rmask: JSON.stringify({
        n: 0,
        destWidth: 0,
        destHeight: 0,
      }),
      rempty: 0,
      risEmpty: true,
      toDataURL: null,
      tempFilePath: [],
      // #endif
    }
  },
  computed: {
    canvasId() {
      // #ifdef VUE2
      return `lime-signature${this._uid}`
      // #endif
      // #ifdef VUE3
      return `lime-signature${this._.uid}`
      // #endif
    },
    offscreenId() {
      return this.canvasId + 'offscreen'
    },
    offscreenSize() {
      const { offscreenWidth, offscreenHeight } = this
      return this.landscape ? [offscreenHeight, offscreenWidth] : [offscreenWidth, offscreenHeight]
    },
    canvasStyle() {
      const { canvasWidth, canvasHeight, backgroundColor } = this
      return {
        width: canvasWidth && canvasWidth + 'px',
        height: canvasHeight && canvasHeight + 'px',
        background: backgroundColor,
      }
    },
    param() {
      const {
        penColor,
        penSize,
        backgroundColor,
        backgroundImage,
        landscape,
        boundingBox,
        openSmooth,
        minLineWidth,
        maxLineWidth,
        minSpeed,
        maxWidthDiffRate,
        maxHistoryLength,
        disableScroll,
        disabled,
      } = this
      return JSON.parse(
        JSON.stringify({
          penColor,
          penSize,
          backgroundColor,
          backgroundImage,
          landscape,
          boundingBox,
          openSmooth,
          minLineWidth,
          maxLineWidth,
          minSpeed,
          maxWidthDiffRate,
          maxHistoryLength,
          disableScroll,
          disabled,
        }),
      )
    },
  },
  // #ifdef APP-NVUE
  watch: {
    param(v) {
      this.$refs.webview.evalJS(`update(${JSON.stringify(v)})`)
    },
  },
  // #endif
  // #ifndef APP-PLUS
  created() {
    const { platform } = uni.getSystemInfoSync()
    this.isPC = /windows|mac/.test(platform)
    this.useCanvas2d = this.type == '2d' && canIUseCanvas2d() && !this.isPC
    // #ifndef H5
    this.showMask = this.isPC
    // #endif
  },
  // #endif
  // #ifndef APP-PLUS
  async mounted() {
    if (this.beforeDelay) {
      await sleep(this.beforeDelay)
    }
    const config = await this.getContext()
    this.signature = new Signature(config)
    this.canvasEl = this.signature.canvas.get('el')
    this.offscreenWidth = this.canvasWidth = this.signature.canvas.get('width')
    this.offscreenHeight = this.canvasHeight = this.signature.canvas.get('height')

    this.stopWatch = this.$watch(
      'param',
      (v) => {
        this.signature.pen.setOption(v)
      },
      {
        immediate: true,
      },
    )
  },
  // #endif
  // #ifndef APP-PLUS
  // #ifdef VUE3
  beforeUnmount() {
    this.stopWatch && this.stopWatch()
    this.signature.destroy()
    this.signature = null
    this.show = false
    // #ifdef APP-VUE || APP-NVUE
    this.rdestroy++
    // #endif
  },
  // #endif
  // #ifdef VUE2
  beforeUnmount() {
    this.stopWatch && this.stopWatch()
    this.signature.destroy()
    this.show = false
    this.signature = null
    // #ifdef APP-VUE || APP-NVUE
    this.rdestroy++
    // #endif
  },
  // #endif
  // #endif
  methods: {
    // #ifdef MP-QQ
    // toJSON() { return this },
    // #endif
    // #ifdef APP-PLUS
    onPageFinish() {
      this.$refs.webview.evalJS(`update(${JSON.stringify(this.param)})`)
    },
    onMessage(e = {}) {
      const {
        detail: {
          data: [res],
        },
      } = e
      if (res.event?.save) {
        this.toDataURL = res.event.save
      }
      if (res.event?.changeSize) {
        const { width, height } = res.event.changeSize
      }
      if (res.event.hasOwnProperty('isEmpty')) {
        this.risEmpty = res.event.isEmpty
      }
      if (res.event?.file) {
        this.tempFilePath.push(res.event.file)
        if (this.tempFilePath.length > 7) {
          this.tempFilePath.shift()
        }
        return
      }
      if (res.event?.success) {
        if (res.event.success) {
          this.tempFilePath.push(res.event.success)
          if (this.tempFilePath.length > 8) {
            this.tempFilePath.shift()
          }
          this.toDataURL = this.tempFilePath.join('')
          this.tempFilePath = []
        } else {
          this.$emit('fail', 'canvas no data')
        }
      }
    },
    // #endif
    redo() {
      // #ifdef APP-VUE || APP-NVUE
      this.rredo += 1
      // #endif
      // #ifdef APP-NVUE
      this.$refs.webview.evalJS(`redo()`)
      // #endif
      // #ifndef APP-VUE
      if (this.signature) this.signature.redo()
      // #endif
    },
    restore() {
      this.redo()
    },
    undo() {
      // #ifdef APP-VUE || APP-NVUE
      this.rundo += 1
      // #endif
      // #ifdef APP-NVUE
      this.$refs.webview.evalJS(`undo()`)
      // #endif
      // #ifndef APP-VUE
      if (this.signature) this.signature.undo()
      // #endif
    },
    clear() {
      // #ifdef APP-VUE || APP-NVUE
      this.rclear += 1
      // #endif
      // #ifdef APP-NVUE
      this.$refs.webview.evalJS(`clear()`)
      // #endif
      // #ifndef APP-VUE
      if (this.signature) this.signature.clear()
      // #endif
    },
    isEmpty() {
      // #ifdef APP-NVUE
      this.$refs.webview.evalJS(`isEmpty()`)
      // #endif
      // #ifdef APP-VUE || APP-NVUE
      this.rempty += 1
      // #endif
      // #ifndef APP-VUE || APP-NVUE
      return this.signature.isEmpty()
      // #endif
    },
    canvasToMaskPath(param = {}) {
      const isEmpty = this.isEmpty()
      // #ifdef APP-NVUE
      this.$refs.webview.evalJS(`mask(${JSON.stringify(param)})`)
      // #endif
      // #ifdef APP-VUE || APP-NVUE
      const stopURLWatch = this.$watch('toDataURL', (v, n) => {
        if (v && v !== n) {
          // if(param.pathType == 'url') {
          base64ToPath(v).then((res) => {
            param.success({
              tempFilePath: res,
              isEmpty: this.risEmpty,
            })
          })
          // } else {
          // 	param.success({tempFilePath: v,isEmpty: this.risEmpty })
          // }
          this.toDataURL = ''
        }
        stopURLWatch && stopURLWatch()
      })
      const { fileType, quality } = param
      const rmask = JSON.parse(this.rmask)
      rmask.n++
      rmask.destWidth = param.destWidth ?? 0
      rmask.destHeight = param.destHeight ?? 0
      // rmask.fileType = fileType
      // rmask.quality = quality
      this.rmask = JSON.stringify(rmask)
      // #endif
      // #ifndef APP-VUE || APP-NVUE
      const width = this.signature.canvas.get('width')
      const height = this.signature.canvas.get('height')

      const { pixelRatio } = uni.getSystemInfoSync()
      if (this.useCanvas2d) {
        this.offscreenWidth = width * pixelRatio
        this.offscreenHeight = height * pixelRatio
      }
      const context = uni.createCanvasContext('offscreen', this)
      const success = (success) => param.success && param.success(success)
      const fail = (fail) => param.fail && param.fail(fail)

      this.signature.pen.getMaskedImageData((imageData) => {
        uni.canvasPutImageData(
          {
            canvasId: 'offscreen',
            x: 0,
            y: 0,
            width: Math.floor(this.offscreenWidth),
            height: Math.floor(this.offscreenHeight),
            data: imageData,
            fail(err) {
              fail(err)
            },
            success: (res) => {
              toDataURL('offscreen', this, param).then((res) => {
                const size = Math.max(this.offscreenWidth, this.offscreenHeight)
                context.restore()
                context.clearRect(0, 0, size, size)
                this.offscreenWidth = width
                this.offscreenHeight = height
                success({
                  tempFilePath: res,
                  isEmpty,
                })
              })
            },
          },
          this,
        )
      })
      // #endif
    },
    canvasToTempFilePath(param = {}) {
      const isEmpty = this.isEmpty()
      // #ifdef APP-NVUE
      this.$refs.webview.evalJS(`save(${JSON.stringify(param)})`)
      // #endif
      // #ifdef APP-VUE || APP-NVUE
      const stopURLWatch = this.$watch('toDataURL', (v, n) => {
        if (v && v !== n) {
          if (this.preferToDataURL) {
            param.success({ tempFilePath: v, isEmpty: this.risEmpty })
          } else {
            base64ToPath(v).then((res) => {
              param.success({
                tempFilePath: res,
                isEmpty: this.risEmpty,
              })
            })
          }
          this.toDataURL = ''
        }
        stopURLWatch && stopURLWatch()
      })
      const { fileType, quality } = param
      const rsave = JSON.parse(this.rsave)
      rsave.n++
      rsave.fileType = fileType
      rsave.quality = quality
      rsave.destWidth = param.destWidth ?? 0
      rsave.destHeight = param.destHeight ?? 0
      this.rsave = JSON.stringify(rsave)
      // #endif
      // #ifndef APP-VUE || APP-NVUE
      const useCanvas2d = this.useCanvas2d
      const success = (success) => param.success && param.success(success)
      const fail = (err) => param.fail && param.fail(err)
      const { canvas } = this.signature.canvas.get('el')
      const { backgroundColor, landscape, boundingBox } = this
      let width = this.signature.canvas.get('width')
      let height = this.signature.canvas.get('height')
      let x = 0
      let y = 0
      const devtools = uni.getSystemInfoSync().platform == 'devtools'
      let preferToDataURL = this.preferToDataURL
      let scale = 1
      // #ifdef MP-TOUTIAO
      scale = devtools ? uni.getSystemInfoSync().pixelRatio : scale
      // 由于抖音不支持canvasToTempFilePath故优先使用createOffscreenCanvas
      preferToDataURL = true
      // #endif
      const canvasToTempFilePath = (image) => {
        const createCanvasContext = () => {
          const useOffscreen = useCanvas2d && !!uni.createOffscreenCanvas && preferToDataURL
          if (useOffscreen && !devtools) {
            const offCanvas = uni.createOffscreenCanvas({ type: '2d' })
            offCanvas.width = this.offscreenSize[0] * scale
            offCanvas.height = this.offscreenSize[1] * scale
            const context = offCanvas.getContext('2d')
            return [context, offCanvas]
          } else {
            const context = uni.createCanvasContext('offscreen', this)
            return [context]
          }
        }

        const [context, offCanvas] = createCanvasContext()
        context.save()
        context.setTransform(1, 0, 0, 1, 0, 0)
        if (landscape) {
          context.translate(0, width * scale)
          context.rotate(-Math.PI / 2)
        }
        if (backgroundColor && !isTransparent(backgroundColor)) {
          context.fillStyle = backgroundColor
          context.fillRect(0, 0, width, height)
        }
        if (offCanvas) {
          const img = canvas.createImage()
          img.src = image
          img.onload = () => {
            context.drawImage(img, 0, 0, width * scale, height * scale)
            const tempFilePath = offCanvas.toDataURL()
            success({
              tempFilePath,
              isEmpty,
            })
          }
        } else {
          context.drawImage(image, 0, 0, width * scale, height * scale)
          context.draw(false, () => {
            toDataURL('offscreen', this, param).then((res) => {
              const size = Math.max(width, height)
              context.restore()
              context.clearRect(0, 0, size, size)
              success({
                tempFilePath: res,
                isEmpty,
              })
            })
          })
        }
      }
      const next = async () => {
        if (this.offscreenWidth != width || this.offscreenHeight != height) {
          this.offscreenWidth = width
          this.offscreenHeight = height
          await sleep(100)
        }

        // #ifndef MP-WEIXIN
        const param = { x, y, width, height, canvas, preferToDataURL }
        // #endif

        // #ifdef MP-WEIXIN
        const param = { x, y, width, height, canvas: useCanvas2d ? canvas : null, preferToDataURL }
        // #endif
        toDataURL(this.canvasId, this, param).then(canvasToTempFilePath).catch(fail)
      }
      // PC端小程序获取不到 ImageData 数据，长度为0
      if (boundingBox && !this.isPC) {
        this.signature.getContentBoundingBox(async (res) => {
          this.offscreenWidth = width = res.width
          this.offscreenHeight = height = res.height

          x = res.startX
          y = res.startY
          next()
        })
      } else {
        next()
      }
      // #endif
    },
    // #ifndef APP-PLUS
    getContext() {
      return getRect(`#${this.canvasId}`, {
        context: this,
        type: this.useCanvas2d ? 'fields' : 'boundingClientRect',
      }).then((res) => {
        if (res) {
          let { width, height, node: canvas, left, top, right } = res
          let { pixelRatio } = uni.getSystemInfoSync()
          let context
          if (canvas) {
            context = canvas.getContext('2d')
            canvas.width = width * pixelRatio
            canvas.height = height * pixelRatio
          } else {
            pixelRatio = 1
            context = uniContext(this.canvasId, this)
            canvas = {
              getContext: (type) => (type == '2d' ? context : null),
              createImage,
              toDataURL: () => toDataURL(this.canvasId, this),
              requestAnimationFrame,
            }
          }
          // 支付宝小程序 使用stroke有个默认背景色
          context.clearRect(0, 0, width, height)
          return {
            left,
            top,
            right,
            width,
            height,
            context,
            canvas,
            pixelRatio,
          }
        }
      })
    },
    getTouch(e) {
      if (this.isPC && this.canvasRect) {
        e.touches = e.touches.map((item) => {
          return {
            ...item,
            x: item.clientX - this.canvasRect.left,
            y: item.clientY - this.canvasRect.top,
          }
        })
      }
      return e
    },
    touchStart(e) {
      if (!this.canvasEl) return
      this.isStart = true
      // 微信小程序PC端不支持事件，使用这方法模拟一下
      if (this.isPC) {
        getRect(`#${this.canvasId}`, { context: this }).then((res) => {
          this.canvasRect = res
          this.canvasEl.dispatchEvent('touchstart', wrapEvent(this.getTouch(e)))
        })
        return
      }
      this.canvasEl.dispatchEvent('touchstart', wrapEvent(e))
    },
    touchMove(e) {
      if (!this.canvasEl || (!this.isStart && this.canvasEl)) return
      this.canvasEl.dispatchEvent('touchmove', wrapEvent(this.getTouch(e)))
    },
    touchEnd(e) {
      if (!this.canvasEl) return
      this.isStart = false
      this.canvasEl.dispatchEvent('touchend', wrapEvent(e))
    },
    // #endif
  },
}
</script>
<!-- #ifdef APP-VUE -->
<script module="sign" lang="renderjs">
import sign from './render'
export default sign
</script>
<!-- #endif -->
<style lang="scss">
.lime-signature,
.lime-signature__canvas {
  /* #ifndef APP-NVUE */
  position: relative;
  width: 100%;
  height: 100%;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex: 1;
  /* #endif */
}
.mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.offscreen {
  position: fixed;
  top: 0;
  left: 9999px;
}
</style>
