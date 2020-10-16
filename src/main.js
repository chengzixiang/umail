// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 2.assets 引入
import "./assets/css/reset.css"

//3.公共组件引入 
import "./components"

//4.utils/request.js 响应拦截 组件用的时候引就行这里不用

//5.过滤器
import "./filters"

//6.main.js引入story 并挂载到根实例上
import store from "./store"

//7.main.js引入element-ui模板
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//8.utils/alert.js 弹窗二次封装




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
