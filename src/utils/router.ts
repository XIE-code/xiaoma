// const { getToken } = require('./auth')
const getToken = () => true

/** 跳转页面 */
function push(url: string) {
  if (getToken()) {
    uni.navigateTo({
      // uni.redirectTo(url, options)：关闭当前页面，跳转到应用内的某个页面。
      // uni.navigateTo(url, options)：关闭当前页面，跳转到应用外的某个页面。
      url,
    })
  } else {
    uni.reLaunch({
      url: '/pages/login/login', // 关闭所有页面，打开到应用内的某个页面。
    })
  }
}

// 返回上一页
function pop() {
  uni.navigateBack()
}

function popRoot(number) {
  uni.navigateBack({
    delta: number,
  })
}

// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
function switchTab(url) {
  if (getToken()) {
    uni.switchTab({
      url,
    })
  } else {
    uni.reLaunch({
      url: '/pages/login/login',
    })
  }
}

// 关闭当前页面，跳转到应用内的某个页面
function redirectTo(url) {
  uni.redirectTo({
    url,
  })
}

// 关闭所有页面，打开到应用内的某个页面
function reLaunch(url) {
  uni.reLaunch({
    url,
  })
}

export { push, pop, popRoot, switchTab, redirectTo, reLaunch }
