<template>
    <div>
        <div class="recommend">
            <h3>为你推荐</h3>
            <ul class="productList">
                <li class="item" v-for="(item, key) in products" :key="key">
                    <!-- 传递  商品对应的id 编号给  productDetail-->
                    <!--<router-link :to="'/productDetail?id='+item.id" class="link">-->
                    <router-link :to="'/productDetail/' + item._id" class="link">
                        <div class="list-img">
                            <img v-lazy="`${url}/${item.goods_img.split(',')[0]}`" alt />
                        </div>
                        <div class="over">{{item.title}}</div>
                        <p class="info">
                            <span class="price">¥{{ item.market_price }}</span>
                            <span>点击量:{{ item.click_count }}</span>
                        </p>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import config from "@/assets/js/config";
    export default {
        name: "productList",
        data() {
            return {
                products: [],
                url: config.api,
            };
        },
        methods: {
            getProductList() {
                this.$axios
                    .get(config.api + "/index/items/is_best")
                    .then((res) => {
                        console.log("推荐商品", res.data.data);
                        this.products = res.data.data;
                        console.log(this.products);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
        },
        mounted() {
            // 获得 推荐商品数据 ，函数调用
            this.getProductList();
        },
    };
</script>
<style scoped>
    /*推荐样式*/
    .recommend h3 {
        position: relative;
        height: 70px;
        font-size: 16px;
        line-height: 70px;
        text-align: center;
        color: #0080ff;
        margin: 0 16px;
    }

    .recommend h3::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: 40%;
        height: 1px;
        background: #ccc;
    }

    .recommend h3::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 0;
        width: 40%;
        height: 1px;
        background: #ccc;
    }

    .recommend .list-img {
        position: relative;
        width: 100%;
        padding-top: 100%;
        /* 让我的图100% 在父亲的分栏宽的显示*/
        margin-bottom: 5px;
    }

    .recommend img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .recommend .productList {
        display: flex;
        /*行显示*/
        flex-wrap: wrap;
        /*折行*/
        justify-content: space-between;
    }

    .productList .item {
        width: 49%;
        /*分两栏*/
        padding: 6px 0 10px 0;
    }

    .productList .info {
        display: flex;
        /*价格行显示*/
        justify-content: space-around;
        padding: 10px 0 0 0;
    }

    .info .price {
        font: bold 16px 微软雅黑;
        color: #f00;
    }

    .info .slimer {
        border: 1px solid #ccc;
        padding: 2px 6px;
        border-radius: 7px;
        line-height: 27px;
    }
</style>