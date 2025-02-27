import { CustomRequestOptions } from '@/interceptors/request'
import { convertSnakeToCamel } from '@/utils/tools'

export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<T>((resolve, reject) => {
    console.log('options :>> ', options)
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      timeout: 120000,
      // 响应成功
      success(res) {
        const successResult = res.data as IResData<T>

        // 其他错误 -> 根据后端错误信息轻提示
        if (successResult.code !== '1') {
          // 登录接口返回的错误格式不是{msg,code,data}，暂不处理
          reject(successResult)
        } else {
          /* 格式化data的Key命名 */
          resolve(convertSnakeToCamel(successResult.data))
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export const httpGet = <T>(url: string, query?: Record<string, any>) => {
  console.log('httpGet :>> ', url, query)
  return http<T>({
    url,
    query,
    method: 'GET',
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
  })
}

http.get = httpGet
http.post = httpPost
