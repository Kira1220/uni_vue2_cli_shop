import Vue from 'vue'
import App from './App'

// 导入网络请求的包
import { $http } from "@escook/request-miniprogram" //终端下载包，引入按需导入 $http 对象
uni.$http = $http //在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用

// 请求拦截器
$http.beforeRequest = function(options) {
    uni.showLoading({
      title: '数据加载中...'
    })
  }
  // 响应拦截器
$http.afterRequest = function() {
    uni.hideLoading()
  }
  // 设置请求的根路径
  // $http.baseUrl = 'https://www.uinav.com'
$http.baseUrl = 'https://api-ugo-web.itheima.net'

// 封装uni.$showMsg()方法：在main.js中，为uni对象挂载自定义的$showMsg()方法
uni.$showMsg = function(title = "数据加载失败", duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()