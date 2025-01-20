<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '小马商城',
  },
}
</route>

<template>
  <web-view :src="webViewUrl"></web-view>
</template>

<script lang="ts" setup>
const webViewUrl = ref('https://shop.sharemarttech.com/pages')
onLoad((options) => {
  webViewUrl.value = webViewUrl.value + options.urlParams
})
</script>

<style lang="scss" scoped></style>
