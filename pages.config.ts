import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'custom',
    navigationBarTitleText: '小马养梯',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    // todo  自定义组件-自动导入
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    custom: true,
    color: '#8A8A8A',
    selectedColor: '#539DF3',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home-select.png',
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        iconPath: 'static/tabbar/maintenance.png',
        selectedIconPath: 'static/tabbar/maintenance-select.png',
        pagePath: 'pages/maintenance/maintenance',
        text: '保养',
      },
      {
        iconPath: 'static/tabbar/forewarning.png',
        selectedIconPath: 'static/tabbar/forewarning-select.png',
        pagePath: 'pages/forewarning/forewarning',
        text: '急修',
      },
      {
        iconPath: 'static/tabbar/personal.png',
        selectedIconPath: 'static/tabbar/personal-select.png',
        pagePath: 'pages/personal/personal',
        text: '我的',
      },
    ],
  },
})
