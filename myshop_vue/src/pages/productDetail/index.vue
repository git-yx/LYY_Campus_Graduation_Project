<template>
    <div>
        <!--头部导航-->
        <nav-bar>
            <span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
            <div slot="center">详情页</div>
            <span slot="right" class="iconfont icon-saoyisao"></span>
        </nav-bar>
        <!--swiper 轮播图-->
        <swiper :options="options" v-if="ok" style="height:414px;">
            <swiper-slide v-for="(item,key) in swipers" :key="key">
                <img :src="`${url}/${item}`" alt>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <!--详情页产品标题信息-->
        <div class="product-wrap">
            <div class="info">
                <p class="price">
                    <span>¥{{productOne.market_price}}</span>
                    <del>{{productOne.shop_price}}</del>
                </p>
                <p class="time">
                    <b>距秒杀时间还剩:</b>
                    <br>
                    <span>10:20:10</span>
                </p>
            </div>
            <div class="title-info">
                <p class="title">{{productOne.title}}</p>
                <p class="dec">{{productOne.goods_keywords}}</p>
            </div>
        </div>
        <!--添加到购物车按钮-->
        <div class="cart-info">
            <div class="like" v-if="!isLike" @click="userlike">
                <i class="iconfont icon-shoucang"></i>
                未收藏
            </div>
            <div class="like" v-if="isLike" @click="userunlike">
                <i class="iconfont icon-shoucang" style="color:#f00"></i>
                已经收藏
            </div>
            <div class="cart-btn" @click="addPop">添加购物车</div>
            <div class="cart-btn red">立即购买</div>
        </div>
        <!--详情页产品图片展示信息-->
        <div class="item-desc">
            <h3>产品详情</h3>
            <div class="item-content">
                <div v-html="productOne.goods_content"></div>
            </div>
        </div>

        <!-- 下侧弹层-->
        <mt-popup class="mypop" v-model="popupVisible" position="bottom">
            <div class="cancel" @click="close">
                <i class="iconfont icon-cuowu"></i>
            </div>
            <div class="product-one">
                <div class="one-image">
                    <img :src="`http://localhost:3000/${swipers[0]}`" alt>
                </div>
                <div class="one-info">
                    <div class="price">{{productOne.priceDiscount}}</div>
                    <div class="one-choose" v-html="chooseContent"></div>
                </div>
            </div>
            <div class="product-color">
                <div class="color-type">
                    <h3>颜色</h3>
                    <div class="color">
                        <div v-for="(item,key) in goodsColor" :key="key" @click="changeCurId(key)"
                            :class="{active:key==curId}">{{item}}</div>
                    </div>
                </div>
            </div>
            <div class="product-type">
                <div class="size-type">
                    <h3>型号</h3>
                    <div class="size">
                        <div v-for="(item,key) in goodsSize" :key="key" @click="changeCurId2(key)"
                            :class="{active:key==curId2}">{{item}}</div>
                    </div>
                </div>
            </div>
            <button @click.stop="addCart" class="one-btn">添加购物车</button>
        </mt-popup>
    </div>
</template>
<script>
    import { MessageBox } from "mint-ui";
    import navBar from "@/components/navBar";
    import { swiper, swiperSlide } from "vue-awesome-swiper";
    import config from "@/assets/js/config";
    export default {
        name: "productDetail",
        data() {
            return {
                isLike: false,
                url: "",
                chooseContent: "请选择颜色和型号",
                curId: null,
                curId2: null,
                popupVisible: false, // 下侧弹层的变量
                addGoods: [], // 本地存储中获得商品数据
                itemDescArray: [],
                productOne: [],
                goodsSize: [],
                goodsColor: [],
                ok: false,
                swipers: [],
                options: {
                    direction: "horizontal",
                    loop: true,
                    pagination: {
                        el: ".swiper-pagination"
                    },
                    autoplay: {
                        delay: 2000,
                        disableOnInteraction: false
                    }
                }
            };
        },
        components: {
            navBar,
            swiper,
            swiperSlide
        },
        watch: {
            curId() {
                this.chooseContent =
                    "选择的是：" +
                    this.goodsSize[this.curId2] +
                    "," +
                    this.goodsColor[this.curId];
            },
            curId2() {
                this.chooseContent =
                    "选择的是：" +
                    this.goodsSize[this.curId2] +
                    "," +
                    this.goodsColor[this.curId];
            }
        },
        created() {
            if (window.localStorage.getItem("userinfo")) {
                this.userIsLike();
            }
        },
        methods: {
            userIsLike() {
                var userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
                this.$axios
                    .get(
                        config.api +
                        "/item/userIsLikeItem?userId=" +
                        userId +
                        "&itemId=" +
                        this.$route.params.id
                    )
                    .then(res => {
                        if (res.data.success) {
                            this.isLike = true;
                        } else {
                            this.isLike = false;
                        }
                    });
            },
            userlike() {
                if (!window.localStorage.getItem("userinfo")) {
                    MessageBox.alert("您尚未登录!").then(action => {
                        this.$router.push("/login");
                    });
                } else {
                    var userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
                    this.$axios
                        .get(
                            config.api +
                            "/item/like?userId=" +
                            userId +
                            "&itemId=" +
                            this.$route.params.id
                        )
                        .then(res => {
                            console.log(res.data);
                            if (res.data.success) {
                                this.isLike = true;
                                location.reload();
                            }
                        });
                }
            },
            userunlike() {
                if (!window.localStorage.getItem("userinfo")) {
                    MessageBox.alert("您尚未登录!").then(action => {
                        this.$router.push("/login");
                    });
                } else {
                    var userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
                    this.$axios
                        .get(
                            config.api +
                            "/item/unlike?userId=" +
                            userId +
                            "&itemId=" +
                            this.$route.params.id
                        )
                        .then(res => {
                            if (res.data.success) {
                                this.isLike = false;
                                location.reload();
                            }
                        });
                }
            },
            changeCurId(key) {
                this.curId = key;
            },
            changeCurId2(key) {
                this.curId2 = key;
            },
            goback() {
                // 返回历史对象的上一页
                this.$router.go(-1);
            },
            getProductOne() {
                this.$axios
                    .get(config.api + "/items/searchById?itemId=" + this.$route.params.id)
                    .then(res => {
                        console.log('产品详细信息',res.data.data)
                        this.productOne = res.data.data;
                        this.swipers = res.data.data.goods_img.split(","); //string类型转为对象
                        this.goodsSize = JSON.parse(res.data.data.goods_size);
                        this.goodsColor = JSON.parse(res.data.data.goods_color);
                        this.swipers.pop();
                        this.url = config.api;
                        console.log(res.data,this.swipers);
                        this.ok = true; // 作用: 保证先加载$axios 数据 然后加 swiper DOM标记
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            addPop() {
                // 打开弹层
                this.popupVisible = true;
            },
            close() {
                // 关闭弹出层
                this.popupVisible = false;
            },
            addCart() {
                if (
                    this.chooseContent.indexOf("undefined") != -1 ||
                    this.chooseContent == "请选择颜色和型号"
                ) {
                    //alert("请至少选择一个产品去结算");
                    MessageBox.alert("你没选择颜色或者型号 ");
                } else {
                    // 添加购物车
                    let bool = true;
                    // 1.从本地存储中获得 商品数据 addGoods 数据
                    this.addGoods = JSON.parse(localStorage.getItem("addGoods")) || [];
                    // 设置修改  state 中num 数量 （加1）
                    this.$store.dispatch("addShopNumAction", 1);
                    for (var i = 0; i < this.addGoods.length; i++) {
                        let item = this.addGoods[i];
                        if (item.id == this.productOne._id) {
                            // 修改商品数量
                            var newAddGoodOne = {
                                id: item.id,
                                num: this.$store.getters.getShopNum //获得数量的值
                            };
                            this.addGoods.splice(i, 1); //删除旧数据
                            this.addGoods.push(newAddGoodOne); //在添加修改的数据
                            bool = false;
                        }
                    }
                    //  b.如果没有直接添加商品信息
                    if (bool) {
                        // 添加新商品
                        var newAddGoodOne = {
                            id: this.productOne._id,
                            num: 1
                        };
                        this.addGoods.push(newAddGoodOne);
                    }
                    // (3)  将addGoods 数据  保存到本地存储中
                    localStorage.setItem("addGoods", JSON.stringify(this.addGoods));
                    MessageBox.alert("添加成功 ");
                    // 关闭弹出层
                    this.popupVisible = false;
                }
            }
        },
        mounted() {
            // 获得从 产品列表中 传递过来的 id号， 然后调用接口通过 id号找指定产品
            //console.log(this.$route.params.id);
            this.getProductOne();
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

    .navbar {
        background: linear-gradient(#eee, #ddd) !important;
    }

    .info {
        display: flex;
        height: 50px;
    }

    .info .price {
        width: 65%;
        background: #f60;
    }

    .info .price span {
        font: bold 30px/50px 微软雅黑;
        color: #fff;
        padding: 0 10px;
    }

    .info .price del {
        font: 16px/50px 微软雅黑;
        color: #fff;
        padding: 0 10px;
    }

    .info .time {
        width: 35%;
        background: #eee;
        font-size: 12px;
        padding: 14px 10px 0;
    }

    .info .time span {
        color: #f00;
        padding: 10px 0 0 0;
    }

    .title-info {
        padding: 10px;
    }

    .title-info .title {
        font: bold 20px 微软雅黑;
    }

    .title-info .dec {
        font: 12px 微软雅黑;
        color: #999;
    }

    /* 商品详情内容 */
    .item-desc h3 {
        font: bold 14px/30px 微软雅黑;
        padding: 0 10px;
        color: #333333;
    }

    .item-content {
        width: 100% !important;
        background-color: #f6f6f6;
        padding: 15px 0 0 15px;
        /* 固定底部后，商品详情中的最后的50rpx内容会被遮挡 */
        padding-bottom: 50px;
        line-height: 25px;
    }

    .item-content img {
        width: 100% !important;
    }

    .lazyImg {
        width: 100% !important;
    }

    /*添加到购物车按钮*/
    .cart-info {
        display: flex;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }

    .like {
        width: 26%;
        background: #eee;
    }

    .cart-btn {
        width: 37%;
        background: linear-gradient(138deg, #ffa600, #ffb000 77%, #ffbc00);
        color: #fff;
    }

    .cart-btn.red {
        background: linear-gradient(-41deg, #ff4f18, #ff2000 24%, #f10000);
    }

    /*下侧弹层样式*/
    .mypop {
        width: 100%;
        height: 450px;
        background: #fff;
    }

    /*弹层内容样式*/
    .product-one {
        display: flex;
    }

    .product-one .one-image {
        margin: -15px 10px 0 20px;
        width: 120px;
        height: 120px;
        box-shadow: 0px 0px 3px rgb(0, 0, 0, 0.3);
        border: 3px solid #fff;
    }

    .one-image img {
        width: 100%;
        height: 100%;
    }

    .price {
        color: #f00;
    }

    .one-choose {
        padding: 10px 0;
        font-size: 12px;
    }

    .product-type {
        padding-top: 10px;
    }

    .size-type h3 {
        font-size: 12px;
        color: #aaa;
        margin: 10px 0 0 10px;
    }

    .size {
        display: flex;
        padding-top: 10px;
        flex-wrap: wrap;
        align-items: center;
        height: 80px;
    }

    .size div {
        width: 15%;
        border-radius: 4px;
        background: #eee;
        text-align: center;
        font-size: 12px;
        line-height: 30px;
        margin: 0 0 10px 10px;
    }

    .size div.active {
        background: #f00;
        color: #fff;
    }

    .color-type h3 {
        font-size: 12px;
        color: #aaa;
        margin: 10px 0 0 10px;
    }

    .color {
        display: flex;
        padding-top: 10px;
        flex-wrap: wrap;
        align-items: center;
        height: 80px;
    }

    .color div {
        width: 15%;
        border-radius: 4px;
        background: #eee;
        text-align: center;
        font-size: 12px;
        line-height: 30px;
        margin: 0 0 10px 10px;
    }

    .color div.active {
        background: #f00;
        color: #fff;
    }

    .one-btn {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 38px;
        background: #f00;
        color: #fff;
        border: 0;
    }

    .cancel {
        position: absolute;
        top: 5px;
        right: 10px;
    }
</style>