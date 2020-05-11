<template>
    <div class="page">
        <!--购物车navbar 导航-->
        <nav-bar>
            <span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
            <div slot="center">收藏夹</div>
            <span slot="right" class="iconfont icon-saoyisao"></span>
        </nav-bar>
        <!--没商品的页面-->
        <div v-if="!hasProduct" class="no-cart">
            <img src="@/assets/images/no-cart.png" style="width:100px;" />
            <p class="no-cart-p">
                你的收藏夹还是空的
                <br>
                <br>
                <mt-button type="danger" size="normal" @click="gohome">到首页</mt-button>
            </p>
        </div>
        <!--有商品的页面-->
        <div v-if="hasProduct" class="has-cart">
            <!--<i class="iconfont" :class="mycheck?'icon-yigouxuan':'icon-weigouxuan'"></i>-->
            <h3>口红专营店</h3>
            <ul class="my-addList">
                <li class="my-item" v-for="(save,key) in likeList" :key="key">
                    <div class="image">
                        <img :src="`${url}/${save.likeList[0].goods_img.split(',')[0]}`" />
                    </div>
                    <div class="info">
                        <p class="title">{{save.likeList[0].title}}</p>
                        <p class="price">¥{{save.likeList[0].market_price}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import { MessageBox } from "mint-ui";
    import navBar from "@/components/navBar";
    import config from "@/assets/js/config";
    // 导入 GoodTool 文件
    import GoodTool from "@/assets/js/GoodTool";
    export default {
        name: "cart",
        data() {
            return {
                hasProduct: false,
                likeList: [],
                url: config.api
            };
        },
        components: {
            navBar
        },
        mounted() {
            this.getSaveProducts();
        },
        methods: {
            goback() { this.$router.go(-1); },
            gohome() {
                // 路由跳转
                this.$router.push("/home");
            },
            // 获得多个商品数据
            getSaveProducts() {
                let userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
               this.$axios
                        .get(config.api + "/like/queryAlllikes?userId=" + userId)
                        .then(res => {
                            let data = res.data;
                            if(data.success){
                                this.likeList = data.data;
                                this.hasProduct = true;
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        });
            }
        }
    };
</script>
<style scoped>
    .navbar {
        background: linear-gradient(#eee, #ddd) !important;
        /*渐变*/
    }

    /*没商品的样式*/
    .no-cart {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 100px 0 10px;
    }

    .no-cart-p {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0px 0 10px;
    }

    .no-cart img {
        width: 50%;
        height: 50%;
    }

    .no-cart p {
        padding: 30px 0;
        font: 20px 微软雅黑;
    }

    .has-cart {
        padding: 10px;
    }

    .has-cart h3 {
        padding: 10px 0;
        font: bold 14px 微软雅黑;
    }

    .my-item {
        display: flex;
        height: 78px;
        margin-bottom: 10px;
    }

    .mycheckbox {
        width: 10%;
        text-align: center;
        line-height: 60px;
    }

    .image {
        width: 20%;
    }

    .image img {
        width: 100%;
        height: 100%;
    }

    .info {
        padding: 0 6px;
        font: 12px/20px 微软雅黑;
    }

    .title{
        width: 100%;
    }

    .info .price {
        color: #f00;
    }

    .productNum {
        width: 20%;
        display: flex;
        align-items: center;
    }

    .reduce,
    .plus {
        display: inline-block;
        width: 20px;
        height: 15px;
        border: 1px solid #ccc;
        background: #eee;
        text-align: center;
        line-height: 15px;
    }

    .num {
        display: inline-block;
        width: 15px;
        height: 15px;
        font-size: 12px;
        text-align: center;
    }

    .del {
        width: 10%;
    }

    .del button {
        display: inline-block;
        height: 60px;
        border: 0;
        background: #f00;
        color: #fff;
        padding: 0 3px;
    }

    /*底部 结算*/
    .calc {
        display: flex;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 60px;
        background: #fff;
        z-index: 9999 !important;
        line-height: 60px;
        padding: 0 0 0 10px;
    }

    .chooseAll {
        width: 20%;
    }

    .price {
        width: 50%;
    }

    .price .total {
        color: #f00;
    }

    .order {
        width: 30%;
        height: 60px;
        background: #f00;
        text-align: center;
        color: #fff;
    }
</style>