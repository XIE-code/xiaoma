/*
 * 过滤手机号脱敏显示
 */
export function phoneShow(mobile) {
  const reg = /(\d{3})\d{4}(\d{4})/
  const tel = mobile.replace(reg, '$1****$2')
  return tel
}

/*
 * 过滤用户名称脱敏显示
 */
export function userNameShow(str) {
  return str.length > 2
    ? str.substr(0, 1) + new Array(str.length - 1).join('*') + str.substr(-1)
    : str.substr(0, 1) + new Array(str.length).join('*')
}

/*
 * 过滤身份证脱敏显示
 */
export function userNoShow(str) {
  console.log('str:', str)
  return str.replace(/(\w{6})\w*(\w{4})/, '$1********$2')
}

export function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }
  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)
  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.'),
  }
}

export function loginTypeId() {
  let lastLoginTypeId = 5
  // #ifdef  APP-PLUS
  if (uni.getSystemInfoSync().platform === 'ios') {
    lastLoginTypeId = 6
  }
  // #endif
  // #ifdef  MP-WEIXIN
  lastLoginTypeId = 1
  // #endif
  // #ifdef  MP-ALIPAY
  lastLoginTypeId = 4
  // #endif
  return lastLoginTypeId
}

export function payChannel() {
  let payChannel = '1300'
  // #ifdef  MP-WEIXIN
  payChannel = '1102'
  // #endif
  // #ifdef  MP-ALIPAY
  payChannel = '1202'
  // #endif
  return payChannel
}

export function payMode(type) {
  let payMode = ''
  if (type === 0) {
    // 微信支付
    payMode = '2000'
  } else if (type === 1) {
    // 支付宝支付
    payMode = '3000'
  } else if (type === 2) {
    // 银联支付
    payMode = '4000'
  } else if (type === 3) {
    // 余额支付
    payMode = '1'
  }
  return payMode
}
