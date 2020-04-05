<template>
    <div>
        <!--头部导航 nav-bar 组件-->
        <nav-bar>
            <!--可以更改插槽坑的内容-->
            <span slot="left">
                <img src="@/assets/images/ml.png" alt>
            </span>
            <div class="search" slot="center">
                <i class="jd-logo"></i>
                <i class="fangd"></i>
                <input type="text" class="key" title="搜索框" placeholder="商品5折" @click="goToSearch">
            </div>
            <span slot="right">
                <a href="#" v-if="!isLogin" @click="toLogin">登录</a>
                <a href="#" v-else>💄</a>
            </span>
        </nav-bar>
        <!--swiper 轮播图-->
        <swiper :options="options" v-if="ok">
            <swiper-slide v-for="(item,key) in swipers" :key="key">
                <img :src="`${url}/${item.focus_img}`" alt>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <!--二级导航-->
        <ul class="second-nav">
            <li v-for="(item,key) in navs" :key="key" class="item">
                <a href="#" class="item-img" @click.stop="toDeatil(item.id)">
                    <img :src="item.urlImg" alt>
                    <span>{{item.title}}</span>
                </a>
            </li>
        </ul>
        <!--推荐商品-->
        <product-list></product-list>
    </div>
</template>
<script>
    import navBar from "@/components/navBar";
    import { swiper, swiperSlide } from "vue-awesome-swiper";
    import productList from "@/pages/home/productList";

    import config from "@/assets/js/config";
    export default {
        name: "home",
        data() {
            return {
                isLogin:false,
                url: "",
                ok: false,
                swipers: [],
                options: {
                    direction: "horizontal",
                    loop: true,
                    pagination: { el: ".swiper-pagination" },
                    autoplay: {
                        delay: 2000,
                        disableOnInteraction: false
                    }
                },
                navs: [
                    { id:"5e8998712e9f3b0c3eb18c66",title: "Dior", urlImg: require("@/assets/index/diao.gif") },
                    { id:"5e8998812e9f3b0c3eb18c67",title: "M.A.C", urlImg: require("@/assets/index/mac.gif") },
                    { id:"5e89988a2e9f3b0c3eb18c68",title: "YSL", urlImg: require("@/assets/index/ysl.gif") },
                    { id:"5e8998942e9f3b0c3eb18c69",title: "乔治·阿玛尼", urlImg: require("@/assets/index/arm.gif") },
                    { id:"5e89989e2e9f3b0c3eb18c6a",title: "L'OREAL", urlImg: require("@/assets/index/lore.gif") },
                    { id:"5e8998a72e9f3b0c3eb18c6b",title: "Givenchy", urlImg: require("@/assets/index/given.gif") },
                    { id:"5e8998b12e9f3b0c3eb18c6c",title: "CARSLAN", urlImg: require("@/assets/index/cars.gif") },
                    { id:"5e8998bb2e9f3b0c3eb18c6d",title: "MAYBELLINE", urlImg: require("@/assets/index/may.gif") },
                    { id:"5e8998c22e9f3b0c3eb18c6e",title: "CHANEL", urlImg: require("@/assets/index/chanel.gif") },
                    { id:"5e8998ca2e9f3b0c3eb18c6f",title: "EsteeLauder", urlImg: require("@/assets/index/estee.gif") }
                ]
            };
        },
        components: {
            navBar,
            swiper,
            swiperSlide,
            productList
        },
        mounted() { 
            this.getSwiper() 
            let user = localStorage.getItem('userinfo')
            user? this.isLogin = true : this.isLogin = false;
        },
        methods: {
            // 跳转搜索
            goToSearch() { this.$router.push("/search") },
            // 获取轮播图
            getSwiper() {
                this.$axios
                .get(config.api + "/index/carousels")
                .then(res => {
                    this.swipers = res.data.data;
                    this.ok = true; // 作用: 保证先加载$axios 数据 然后加 swiper DOM标记
                    this.url = config.api;
                })
                .catch(e => console.log);
            },
            // 跳转详情
            toDeatil(id){
                localStorage.setItem('curTitle',id);
                this.$router.push({name: 'category'});
            },
            // 登录
            toLogin(){
                this.$router.push({name: 'login'});
            }
        }
    };
</script>
<style scoped>
    /* swiper 样式*/
    .swiper-container {
        width: 100%;
        height: 200px;
    }

    .swiper-container img {
        width: 100%;
        height: 100%;
    }

    /*头部导航样式*/
    .search {
        position: relative;
        display: flex;
        padding: 10px 0 10px 75px;

        border-radius: 20px;
        background: #fff;
    }

    .search .key {
        flex: 1;
        border: 0;
        font-size: 14px;
        margin-right: 10px;
    }

    .search .jd-logo {
        display: inline-block;
        position: absolute;
        left: 10px;
        top: 10px;
        width: 20px;
        height: 15px;
        background: url(~@/assets/images/log.png) no-repeat;
        background-size: 20px 15px;
    }

    .search .fangd {
        display: inline-block;
        position: absolute;
        left: 35px;
        top: 12px;
        width: 18px;
        height: 15px;
        background: url(~@/assets/images/icon.png) no-repeat -80px 0;
        background-size: 200px;
        margin: 0 0 0 6px;
        border-left: 1px solid #ccc;
    }

    /*二级导航样式*/
    .second-nav {
        display: flex;
        /*行显示*/
        flex-wrap: wrap;
        /*折行*/
        padding: 10px 0;
        justify-content: space-around;
        align-items: center;
    }

    .second-nav .item {
        width: 20%;
        /*行显示分栏 5列*/
        padding-top: 3px;
    }

    .second-nav .item-img {
        display: flex;
        /*列显示*/
        flex-direction: column;
        align-items: center;
    }

    .second-nav span {
        margin-top: 4px;
    }

    .second-nav img {
        width: 70%;
        height: 70%;
    }
</style>