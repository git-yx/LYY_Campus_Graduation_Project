<template>
    <div class="tabcontent">
        <h3 class="bigtitle">{{ catName }}</h3>
        <div v-if="productByCat.length > 0">
            <ul class="cateProdouct">
                <li class="item" v-for="(item, key) in productByCat" :key="key">
                    <router-link :to="'/productDetail/' + item._id" class="link">
                        <p class="image">
                            <img v-lazy="`${url}/${item.goods_img.split(',')[0]}`" alt />
                        </p>
                        <p class="title">{{ item.title }}</p>
                        <p class="info">
                            <span class="price">{{ item.market_price }}元</span>
                            <span class="like" style="color:#000;">喜欢:{{ item.click_count }}</span>
                        </p>
                    </router-link>
                </li>
            </ul>
        </div>
        <div v-else>没有查到商品</div>
    </div>
</template>
<script>
    import config from "@/assets/js/config";
    export default {
        name: "tabContent",
        data() {
            return {
                productByCat: [],
                url: config.api,
            };
        },
        // 父传子 curId数据
        props: {
            curId: {},
            catName: {
                type: String,
                default: "标题"
            },
        },
        watch: {
            curId() {
                //(重点) watch中获得动态的curId
                console.log(this.curId);
                this.getContent();
            },
        },
        mounted() {
            setTimeout(() => {
                this.getContent();
            }, 100);
        },
        methods: {
            getContent() {
                if(!this.curId) return ;
                this.$axios
                    .get(config.api + "/items/searchByCat?catId=" + this.curId)
                    .then((res) => {
                        console.log(res.data.data);
                        this.productByCat = res.data.data;
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
        }
    };
</script>
<style scoped>
    .tabcontent {
        flex: 1;
        padding: 12px 0 0 12px;
    }

    .bigtitle {
        font: bold 18px 微软雅黑;
        padding: 0 0 20px 0;
    }

    .cateProdouct {
        display: flex;
        flex-wrap: wrap;
        /*折行*/
        justify-content: space-between;
    }

    .cateProdouct .item {
        width: 49%;
        margin-bottom: 10px;
    }

    .cateProdouct .image img {
        width: 100%;
        height: 100%;
    }

    .cateProdouct .title {
        padding: 6px 0;
        font-size: 14px;
    }

    .cateProdouct .info {
        display: flex;
        justify-content: space-between;
        padding: 0 3px;
    }

    .cateProdouct .price {
        color: #f00;
        font-size: 12px;
    }

    .cateProdouct .like {
        color: #ccc;
        font-size: 12px;
    }
</style>