<template>
    <div>
        <!--头部导航-->
        <nav-bar>
            <span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
            <div slot="center">确认订单页</div>
            <span slot="right" class="iconfont icon-saoyisao"></span>
        </nav-bar>
        <div class="page">
            <!-- 收货地址为空的情况 -->

            <div class="empty-address" @click="toAdressInfo()">
                <i class="iconfont icon-dizhiguanli"></i>
                <div class="write-address">{{addressInfo}}</div>
                <i class="iconfont icon-icon-test5"></i>
            </div>

            <div class="orders splitter">
                <div class="item" v-for="(item,key) in orderGoodList" :key="key">
                    <img class="item-cover" v-lazy="`http://localhost:3000/${item.goods_img.split(',')[0]}`" width="120"
                        alt />
                    <div class="item-title">{{item.name}}</div>
                    <div class="price-info">
                        <div class="item-old-line">
                            <div class="item-old-price">￥{{item.shop_price}}</div>
                        </div>
                        <div class="item-price">￥{{item.market_price}}</div>
                        <div class="item-counts">
                            <div>{{item.num}}</div>
                            <div>件</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 配送方式 快递运费 合计 等信息 -->
            <div class="order-info">
                <div class="info-line splitter">
                    <div class="lable-words">运送方式:</div>
                    <div>全国包邮</div>
                </div>
                <div class="info-line splitter">
                    <div class="lable-words">快递费用:</div>
                    <div>￥0.00</div>
                </div>

                <div class="remark-info">
                    <input type="text" placeholder="订单备注" placeholder-class="remark-holder" class="remark" />
                </div>
            </div>
            <!-- 底部提交订单 -->
            <div class="bottom-operator">
                <div class="total-info">
                    <div class="total-words">总计:</div>
                    <div class="total-amount">￥{{totalPrice}}</div>
                </div>
                <div class="submit-order" @click="createOrder">提交订单</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { MessageBox } from "mint-ui";
    import navBar from "@/components/navBar";
    import config from "@/assets/js/config";
    export default {
        name: "confirmOrder",
        data() {
            return {
                orderGoodList: [],
                totalPrice: 0,
                addressInfo: "",
                addressId: ""
            };
        },
        components: {
            // 2. 挂子
            navBar
        },
        mounted() {
            this.getAddress();
            // 从本地存在获得 orderGoodList
            this.orderGoodList = JSON.parse(
                window.localStorage.getItem("orderGoodList")
            );
            console.log(this.orderGoodList);
            // 合计价格
            this.total();
        },
        methods: {
            goback() {
                this.$router.go(-1);
            },
            toAdressInfo() {
                this.$router.push("/addressList");
            },
            getAddress() {
                if (!window.localStorage.getItem("userinfo")) {
                    MessageBox.alert("您尚未登录!").then(action => {
                        this.$router.push("/login");
                    });
                } else {
                    var userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
                }
                this.$axios
                    .get(config.api + "/address/default/" + userId)
                    .then(res => {
                        console.log(res.data.data);
                        if (res.data.data) {
                            this.addressInfo =
                                "收件人:" + res.data.data.name + ",电话:" + res.data.data.phone;
                            this.addressId = res.data.data._id;
                        } else {
                            this.addressInfo = "你当前没地址信息请创建地址";
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            total() {
                let totalPrice = 0;
                for (let i = 0; i < this.orderGoodList.length; i++) {
                    let itemPrice =
                        parseInt(this.orderGoodList[i].num) *
                        this.orderGoodList[i].market_price;
                    totalPrice += itemPrice;
                }
                this.totalPrice = totalPrice;
                console.log(this.totalPrice);
            },
            createOrder() {
                /*  1.  axios 访问接口 itemStr=1001|5,1002|3&buyer=111&address=北京：返回生成订单号
                    2. 在 addGoodList 中去掉已经形成订单的商品
                */
                let addGoodList = JSON.parse(window.localStorage.getItem("addGoods")) || [];
                let orderGoodList = this.orderGoodList;
                if (addGoodList.length != 0) {
                    let itemStr = "";
                    let remark = "";
                    let userId ;
                    for (let i = 0; i < orderGoodList.length; i++) {
                        let itemId = orderGoodList[i]._id;
                        let itemCounts = orderGoodList[i].num;
                        let singleItem = itemId + "|" + itemCounts + ",";
                        itemStr += singleItem;
                    }
                    if (!window.localStorage.getItem("userinfo")) {
                        MessageBox.alert("您尚未登录!").then(action => {
                            this.$router.push("/login");
                        });
                    } else {
                        userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
                    }
                    this.$axios({
                        method: "post",
                        url: config.api + "/order/createOrder",
                        params: {
                            itemStr,
                            userId,
                            addressId: this.addressId
                        },
                        dataType: "json"
                    })
                        .then(res => {
                            // 订单号， 将来 支付拉取支付是传的值
                            if (res.data.success) {
                                console.log('支付结果',res)
                                let orderId = res.data.data;
                                MessageBox.alert("支付成功").then(action => {
                                    for (let i = 0; i < orderGoodList.length; i++) {
                                        let itemId = orderGoodList[i]._id;
                                        for (let j = 0; j < addGoodList.length; j++) {
                                            if (itemId == addGoodList[j].id) {
                                                addGoodList.splice(j, 1);
                                            }
                                        }
                                    }
                                    window.localStorage.setItem( "addGoods", JSON.stringify(addGoodList) );
                                    this.$router.push({ name: "payment", query: { orderId: orderId } });
                                });
                            } else {
                                MessageBox.alert("支付失败");
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
        }
    };
</script>

<style scoped>
    .navbar {
        background: linear-gradient(#eee, #ddd) !important;
        /*渐变*/
    }

    page {
        display: flex;
        flex-direction: column;
        background-color: #f2f5f8;
        /* 解决底部遮挡问题 */
        padding-bottom: 50px;
    }

    /* 收货地址为空 start */
    .empty-address {
        margin-top: 5px;
        background-color: white;

        display: flex;
        flex-direction: row;
        /* 纵轴垂直居中 */
        align-items: center;

        padding-top: 15px;
        padding-left: 10px;
        padding-bottom: 15px;
    }

    .location-ico {
        width: 20px;
        height: 20px;
        /* margin-left: 10rpx; */
    }

    .write-address {
        color: gray;
        font-size: 13px;
        /* flex 子项的放大比例，撑满后，箭头就靠右了 */
        flex-grow: 1;
        margin-left: 5px;
    }

    .arrow-left-ico {
        width: 15px;
        height: 15px;
        margin-right: 5px;
    }

    /* end */

    /* 收货地址存在时 start */
    .full-address {
        margin-top: 5px;
        background-color: white;
        padding-top: 15px;
        padding-left: 10px;
        padding-bottom: 10px;
    }

    .contact-info {
        display: flex;
        flex-direction: row;
        font-size: 14px;
        margin-left: 30px;
    }

    .address-info {
        display: flex;
        flex-direction: row;
        font-size: 13px;
        color: gray;
        margin-top: 8px;
        line-height: 20px;
    }

    .address-province {
        margin-left: 10px;
    }

    .address-city {
        margin-left: 5px;
    }

    .address-district {
        margin-left: 5px;
    }

    .address-desc {
        flex-grow: 1;
    }

    /* end */

    /* 订单商品 start */
    .orders {
        margin-top: 20rpx;
        background-color: white;

        display: flex;
        flex-direction: column;

        padding: 10px;
    }

    .item {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        margin-top: 5px;
    }

    .items-cover {
        width: 75px;
        height: 100px;
        margin-left: 5px;
        border-radius: 3px;
    }

    .item-title {
        font-size: 14px;
        width: 205px;
        margin-left: 10px;
    }

    .price-info {
        font-size: 14px;
        padding: 0 10px 0 0;
    }

    .item-old-line {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .item-old-price {
        font-size: 12px;
        color: gray;
        text-decoration-line: line-through;
        /* 定义删除线 */
    }

    .item-counts {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 10px;
    }

    /* end */

    /* 下边框横线(分割线) start */
    .splitter {
        border-bottom: solid 1px;
        border-color: #e0e0e0;
    }

    /* end */

    /* 配送方式 快递运费 合计 等信息 start */
    .order-info {
        display: flex;
        flex-direction: column;
        background-color: white;
        font-size: 14px;
    }

    .info-line {
        display: flex;
        flex-direction: row;
        padding: 10px;
    }

    .lable-words {
        flex-grow: 1;
    }

    .remark-info {
        padding: 10px;
    }

    .remark {
        background-color: #f4f4f4;
        width: 98%;
        height: 25px;
        border-radius: 3px;
        font-size: 13px;
    }

    .remark-holder {
        color: #c0c0c0;
        font-size: 13px;
    }

    /* end */

    /* 底部提交订单 start */
    .bottom-operator {
        background-color: white;
        height: 60px;
        /* 固定底部不可滑动 */
        position: fixed;
        bottom: 0;
        width: 100%;

        display: flex;
        flex-direction: row;
        z-index: 9999;
    }

    .total-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 18px 10px;
        width: 65%;
    }

    .total-words {
        color: gray;
    }

    .total-amount {
        color: #f60;
        font-weight: bold;
        margin-left: 5px;
    }

    .submit-order {
        color: white;
        background-color: #f00;
        width: 35%;
        text-align: center;
        font-size: 16px;
        line-height: 50px;
    }

    /* end */
</style>