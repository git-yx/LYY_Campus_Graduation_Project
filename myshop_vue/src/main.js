// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'  //生子
import router from './router'
// 引入   px 转  rem 单位
import 'lib-flexible'

// 引入全局  $axios
import axios from 'axios'
Vue.prototype.$axios = axios

// 导入  vuex
import store from './store.js';

// 引入 mint-ui
import Mint from 'mint-ui';
Vue.use(Mint);
import 'mint-ui/lib/style.css'

// 图片懒加载
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload, {
    loading: require("./assets/images/loading.gif")
})

//request 请求拦截器
axios.interceptors.request.use(function (req) {
    // 显示loading
    Mint.Indicator.open('加载中...');
    return req;
})
// response响应拦截器
axios.interceptors.response.use(function (res) {
    // 隐藏loading
    Mint.Indicator.close();
    return res;
})

// swiper css样式
import 'swiper/dist/css/swiper.min.css'
// 导入 css 样式
import './assets/css/jd.css'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,  // 挂路由
    store,  // 挂vuex
    components: { App }, //挂子
    template: '<App/>'  //用子
})
