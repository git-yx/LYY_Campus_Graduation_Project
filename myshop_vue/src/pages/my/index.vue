<template>
    <div>
        <!-- 头部导航 nabbar -->
        <nav-bar>
            <span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
            <div slot="center">我的页面</div>
            <span slot="right" class="iconfont icon-saoyisao"></span>
        </nav-bar>

        <div class="page">
            <!-- 用户未登录的时候显示 -->
            <div class="login-block" v-if="!userLogin">
                <div class="btn-login" @click="login">请登录</div>
            </div>

            <!-- 个人信息 用户已登录后显示 -->
            <div class="userinfo" v-if="userLogin">
                <img class="avatar" src="@/assets/images/mypic.jpg" alt />
                <div class="user-words">
                    <div class="nickname">{{user}}</div>
                </div>
                <i class="iconfont icon-icon-test3" style="margin-left:50px" @click="logout"></i>
            </div>

            <!-- 历史订单 -->
            <div class="order-tab">
                <div class="every-status" @click="queryOrder(0,0)" :class="orderIndex==0?'active':''">
                    <div>
                        <i class="iconfont icon-shoucang"></i>
                    </div>
                    <div>全 部</div>
                </div>

                <div class="every-status" @click="queryOrder(1,10)" :class="orderIndex==1?'active':''">
                    <div>
                        <i class="iconfont icon-wode"></i>
                    </div>
                    <div>待付款</div>
                </div>

                <div class="every-status" @click="queryOrder(2,20)" :class="orderIndex==2?'active':''">
                    <div>
                        <i class="iconfont icon-dizhiguanli"></i>
                    </div>
                    <div>待收货</div>
                </div>

                <div class="every-status" @click="queryOrder(3,40)" :class="orderIndex==3?'active':''">
                    <div>
                        <i class="iconfont icon-RectangleCopy"></i>
                    </div>
                    <div>已完成</div>
                </div>

                <div class="every-status" @click="queryOrder(4,50)" :class="orderIndex==4?'active':''">
                    <div>
                        <i class="iconfont icon-guanbi"></i>
                    </div>
                    <div>已取消</div>
                </div>
            </div>

            <!-- 循环订单    order 每个订单但每个订单可以有多个商品-->
            <div class="orders" v-for="(order,key) in orderList" :key="key">
                <div class="orders-item">
                    <div class="status-div splitter">
                        <div class="gray-words">{{status[order.order_status]}}</div>
                    </div>
                </div>
                <!--  item 循环每个订单中的每个商品-->
                <div class="item splitter" v-for="(item,key) in order.itemList" :key="key">
                    <img class="items-cover" :src="`http://localhost:3000/${item.product_img}`" style="height:75px;"/>
                    <div class="item-title">{{item.product_title}}</div>
                    <div class="price-info" style="margin-left:10px">
                        <div class="item-price">￥{{item.product_price}}</div>
                        <div class="item-counts">
                            <div>{{item.product_num}}</div>
                            <div>件</div>
                        </div>
                    </div>
                </div>

                <div class="money-div splitter">
                    <div class="normal-words">
                        <div class="gray-words">全国包邮</div>
                        <div class="gray-words" style="position:absolute;right:60px">总计:</div>
                        <div class="money-words" style="position:absolute;right:20px">￥{{order.all_price}}</div>
                    </div>
                </div>

                <div class="go-pay">
                    <div v-if="order.status == 10">
                        <div class="btn-cancel" @click="cancelOrder(order.id)">取消订单</div>
                        <div class="btn-pay">付 款</div>
                    </div>
                    <!--<div v-if="order.status == 20">
		                <div class="btn-pay" @click="conformOrder(order.id)">确认收货</div>
                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import navBar from "@/components/navBar";
    import config from "@/assets/js/config";
    export default {
        name: "my",
        components: { navBar },
        data() {
            return {
                userId: "",
                userLogin: false,
                orderIndex: 0,
                user: "",
                orderList: [],
                status: {
                    10: "待付款",
                    20: "待收货",
                    40: "已完成",
                    50: "已取消"
                }
            };
        },
        mounted() {
            this.load(); // 登录状态
            this.getAllOrder(); // 查询所有已经生成订单的商品商品
        },

        methods: {
            queryOrder(index, status) {
                this.orderIndex = index;
                if (!window.localStorage.getItem("userinfo")) {
                    MessageBox.alert("您尚未登录!").then(action => {
                        this.$router.push("/login");
                    });
                } else {
                    this.userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
                }
                this.$axios
                    .get(
                        config.api +
                        "/order/queryAllOrders?userId=" +
                        this.userId +
                        "&orderStatus=" +
                        status
                    )
                    .then(res => {
                        this.orderList = res.data.data;
                        console.log('订单信息',this.orderList)
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 确认订单
            conformOrder(orderid) {
                //this.$axios.defaults.baseURL = "http://localhost:8080";
                this.$axios
                    .post(config.api + "/order/changeToFinished?orderId=" + orderid)
                    .then(res => {
                        if (res.data.status == 200) {
                            location.reload();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 取消订单
            cancelOrder(orderid) {
                this.$axios
                    .post(config.api + "/order/changeToCanceled?orderId=" + orderid)
                    .then(res => {
                        if (res.data.status == 200) {
                            location.reload();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 获取订单
            getAllOrder() {
                if (!window.localStorage.getItem("userinfo")) {
                    this.orderList = [];
                } else {
                    this.userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
                    this.$axios
                        .get(
                            config.api +
                            "/order/queryAllOrders?userId=" +
                            this.userId +
                            "&orderStatus=0"
                        )
                        .then(res => {
                            this.orderList = res.data.data;
                            console.log('默认订单信息',res.data.data);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            },
            // 返回历史对象window.history.go(-1)的上一页
            goback() { this.$router.go(-1) },
            // 判断登录状态
            load() {
                if(localStorage.getItem("userinfo")){
                    this.user = JSON.parse(localStorage.getItem("userinfo"))[0].phone;
                    console.log(this.user);
                }
                if (this.user) this.userLogin = true
                else this.userLogin = false
            },
            login() { return this.$router.push("/login") },
            logout() {
                this.$axios
                    .get(config.api + "/loginOut", { withCredentials: true })
                    .then(res => { 
                        localStorage.removeItem("userinfo") 
                        location.reload();
                    })
                    .catch(e => console.log);
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
        /* 整体竖向排列 */
        background-color: #f2f5f8;
    }

    /* 用户未登录 start */
    .login-block {
        background-color: white;
        padding: 13px 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        border-bottom: 1px solid #ccc;
    }

    .btn-login {
        width: 70px;
        /* 绝对设置宽度，避免不同手机屏幕的兼容性问题 */
        color: white;
        background-color: #f23030;
        font-size: 13px;
        padding: 8px 15px;
        margin-top: 10px;
        border-radius: 25px;
        text-align: center;
    }

    /* end */

    /* 个人信息 start */
    .userinfo {
        display: flex;
        flex-direction: row;
        background-color: white;
        padding: 11px 7px;
    }

    .avatar {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        border-radius: 50%;
    }

    .user-words {
        display: flex;
        flex-direction: column;
        width: 265px;
    }

    .nickname {
        font-size: 16px;
        margin-top: 6px;
    }

    .ico-block {
        display: flex;
        flex-direction: row;
    }

    .vipcard-ico {
        width: 20px;
        height: 20px;
        margin-top: 5px;
    }

    .certified-ico {
        width: 50px;
        height: 32px;
    }

    .set-ico {
        width: 20px;
        height: 20px;
        margin-top: 6px;
    }

    /* end */

    /* 历史订单切换tab */
    .order-tab {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        background-color: white;
        margin-top: 10px;
        padding: 11px 8px;
        font-size: 14px;
    }

    .every-status {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .every-status div {
        padding-bottom: 6px;
    }

    .order-status-ico {
        width: 20px;
        height: 20px;
        align-self: center;
    }

    .status-words {
        margin-top: 5px;
        font-size: 13px;
        color: #868585;
    }

    /* 订单信息 start */
    .orders {
        margin-top: 10px;
        background-color: white;

        display: flex;
        flex-direction: column;

        padding: 10px;
    }

    .orders-item {
        height: 30px;
        line-height: 30px;
    }

    .item {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        margin-top: 5px;
        padding-bottom: 10px;
    }

    .items-cover {
        width: 75px;
        height: 100px;
        margin-left: 5px;
        border-radius: 3px;
    }

    .item-title {
        font-size: 14px;
        width: 410rpx;
        margin-left: 10px;
    }

    .price-info {
        font-size: 13px;
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

    .item-price {
        margin-top: 3px;
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
        border-color: #e6e6e6;
    }

    /* end */

    /* 待付款 start */
    .money-block {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        background-color: white;
        padding-right: 10px;
        /* padding-bottom: 20rpx;  */
    }

    .normal-words {
        display: flex;
        flex-direction: row;
        align-items: center;
        /* 竖向居中 */
    }

    .gray-words {
        margin-left: 10px;
        color: gray;
        font-size: 13px;
    }

    .money-words {
        font-size: 16px;
        color: #f23030;
    }

    .go-pay {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding-right: 10px;
    }

    .btn-pay {
        color: white;
        background-color: #f23030;
        font-size: 13px;
        padding: 6px 20px;
        margin-top: 10px;
        border-radius: 25px;
    }

    .btn-cancel {
        color: #3a3932;
        background-color: #ffe817;
        font-size: 13px;
        padding: 6px 20px;
        margin-top: 10px;
        margin-right: 5px;
        border-radius: 25px;
    }

    .status-block {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 5px;
    }

    .active {
        color: #f00;
    }

    /* end */
</style>