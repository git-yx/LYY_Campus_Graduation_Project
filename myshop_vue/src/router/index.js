import Vue from 'vue'
import Router from 'vue-router'
//引入 生子
//import HelloWorld from '@/components/HelloWorld'
import home from '@/pages/home'
import category from '@/pages/category'
import cmtUpload from '@/pages/category/cmtUpload'
import save from '@/pages/save'
import cart from '@/pages/cart'
import my from '@/pages/my'
import productDetail from '@/pages/productDetail'

import confirmOrder from '@/pages/order/confirmOrder'
import payment from '@/pages/order/payment'

import login from "@/pages/my/login";
import addressList from "@/pages/address/addressList";  // 地址列表页
import addAddress from "@/pages/address/addAddress";   // 添加或更新页

import search from "@/pages/search";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: home
        },
        {
            path: '/category',
            name: 'category',
            component: category
        },
        {
            path: '/cmtUpload',
            name: 'cmtUpload',
            component: cmtUpload
        },
        {
            path: '/cart',
            name: 'cart',
            component: cart
        },
        {
            path: '/save',
            name: 'save',
            component: save
        },
        {
            path: '/my',
            name: 'my',
            component: my
        },
        {
            path: '/productDetail/:id',
            name: 'productDetail',
            component: productDetail
        },
        {
            path: '/confirmOrder',
            name: 'confirmOrder',
            component: confirmOrder
        },
        {
            path: '/payment',
            name: 'payment',
            component: payment
        },
        {
            path: "/login",
            name: "login",
            component: login
        },
        {
            path: "/addressList",
            name: "addressList",
            component: addressList
        },
        {
            path: "/addAddress",
            name: "addAddress",
            component: addAddress
        },
        {
            name: 'search',
            path: '/search',
            component: search
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
})
