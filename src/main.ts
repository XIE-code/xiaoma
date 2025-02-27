import { createSSRApp } from 'vue'
import App from './App.vue'
import store from './store'
import { requestInterceptor, prototypeInterceptor } from './interceptors'
import 'virtual:uno.css'
// import 'weconsole/dist/npm/main/init'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)
  return {
    app,
  }
}
