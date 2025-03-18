<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '修改密码',
  },
}
</route>

<template>
  <wrapper paddingType="top" :backgroundColor="COLOR_SECONDARY">
    <view class="navigation" :style="{ height: px2rpx(capsule.height || 32) }">
      <wd-icon
        name="arrow-left"
        @click="handleClickBack"
        :size="px2rpx(24)"
        color="white"
      ></wd-icon>
      <view class="title">修改密码</view>
    </view>
    <!-- Form -->
    <view class="content">
      <view class="scroll-box">
        <wd-form ref="form" :model="formModel">
          <wd-cell-group border>
            <wd-input
              label="旧密码"
              label-width="100px"
              prop="oldPassword"
              clearable
              v-model="formModel.oldPassword"
              placeholder="请输入6~14位数字"
              :rules="[
                { required: true, message: '请输入旧密码' },
                {
                  required: true,
                  pattern: /^\d{6,14}$/,
                  message: '密码必须是6~14位的纯数字',
                },
              ]"
            />
            <wd-input
              label="新密码"
              label-width="100px"
              prop="newPassword"
              show-password
              clearable
              v-model="formModel.newPassword"
              placeholder="请输入6~14位数字"
              :rules="[
                { required: true, message: '请输入新密码' },
                {
                  required: true,
                  pattern: /^\d{6,14}$/,
                  message: '密码必须是6~14位的纯数字',
                },
              ]"
            />
            <wd-input
              label="新密码"
              label-width="100px"
              prop="reNewPassword"
              show-password
              clearable
              v-model="formModel.reNewPassword"
              placeholder="请输入6~14位数字"
              :rules="[
                { required: true, message: '请重新输入新密码' },
                {
                  required: true,
                  pattern: /^\d{6,14}$/,
                  message: '密码必须是6~14位的纯数字',
                },
                {
                  required: true,
                  validator: handlePasswordValidator,
                  message: '两次密码输入不一致',
                },
              ]"
            />
          </wd-cell-group>
          <view class="footer">
            <wd-button custom-class="submit-btn" size="large" @click="handleClickSubmit">
              提交
            </wd-button>
          </view>
        </wd-form>
      </view>
    </view>
  </wrapper>
</template>

<script lang="ts" setup>
/* components */
import wrapper from '@/layouts/wrapper.vue'
/* store */
import { useSystemStore } from '@/store/system'
/* utils */
import { px2rpx } from '@/utils/tools'
import { md5 } from '@/utils/md5'
import { http } from '@/utils/http'

/* constant */
import { COLOR_SECONDARY } from '@/common/constant'

const systemStore = useSystemStore()
const { capsule } = systemStore.systemInfo

// 导航栏
function handleClickBack() {
  uni.navigateBack()
}

const formModel = reactive({
  oldPassword: '',
  newPassword: '',
  reNewPassword: '',
})

const form = ref()

function handlePasswordValidator(val) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val === formModel.newPassword)
    }, 400)
  })
}

function updatePassword() {
  http
    .post('/userInfo/up_password', {
      old_password: md5(formModel.oldPassword),
      password: md5(formModel.newPassword),
    })
    .then((res) => {
      uni.showToast({ title: '修改成功', icon: 'none' })

      setTimeout(() => {
        handleClickBack()
      }, 600)
    })
    .catch((err) => {
      uni.showToast({ title: err.content, icon: 'none' })

      console.log('updatePassword err :>> ', err)
    })
}

const handleClickSubmit = () => {
  form.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        updatePassword()
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
</script>

<style lang="scss" scoped>
$rpx-17: px2rpx(17);
$rpx-26: px2rpx(26);
$rpx-44: px2rpx(44);

$rpx-53: px2rpx(53);
$rpx-76: px2rpx(76);
$rpx-167: px2rpx(167);

%input-label-font {
  @extend %font-size-lg;
  line-height: $rpx-26;
  color: $color-secondary-69;
}
// 导航栏
.navigation {
  @extend %flex-center;
  flex-shrink: 0;
  gap: $rpx-16;
  justify-content: flex-start;
  padding: 0 $rpx-24;
  background: $color-secondary;

  .title {
    @extend %font-size-xl;
    @extend %flex-center;
    height: $rpx-28;
    color: $color-white;
  }
}
// 内容
.content {
  flex-grow: 1;
  margin-top: $rpx-10;
  overflow: scroll;
  background: $color-white;
  border-radius: $rpx-30 $rpx-30 0 0;

  .scroll-box {
    @extend %flex-column;
    gap: $rpx-24;
    padding: $rpx-16 $rpx-24;

    :deep(.submit-btn) {
      @extend %btn-reset;
      @extend %font-size-lg;
      @extend %flex-center;
      flex-shrink: 0;
      width: $rpx-167;
      height: $rpx-53;
      margin: $rpx-25 auto 0;

      font-size: $rpx-17;
      line-height: $rpx-24;

      color: $color-white;
      letter-spacing: $rpx-1;

      background: $color-secondary;

      border-radius: $rpx-24;
    }
  }
}
</style>
