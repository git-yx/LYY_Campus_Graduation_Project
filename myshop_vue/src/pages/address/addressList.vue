<template lang="html">
    <div class="addressList">
        <!--头部导航-->
        <nav-bar>
            <span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
            <div slot="center">地址列表</div>
            <span slot="right" class="iconfont icon-saoyisao"></span>
        </nav-bar>
        <div class="box">
            <ul>
                <li v-for="(item,index) in addressList" :key="index" @click="setDefault(item)">
                    <div class="txt">
                        <div class="top clfix">
                            <div class="left1">
                                <i class="iconfont"
                                    :class="item.default_address?'icon-yigouxuan1':'icon-weigouxuan'"></i>
                            </div>
                            <div class="leftV">
                                {{item.name}}
                            </div>
                            <div class="rightV">
                                {{item.phone}}
                            </div>
                        </div>
                        <div class="bottom ">
                            {{item.province+','+item.city+','+item.district}}
                        </div>
                    </div>
                    <div class="select">
                        <div class="edit" @click.stop="editAdd(item)">
                            <i class="iconfont icon-shouhuodizhiyebianji"></i> 修改
                        </div>
                        <div class="delete" @click.stop="delAdd(item)">
                            <i class="iconfont icon-changyonggoupiaorenshanchu"></i> 删除
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="btn" @click="add()">
            添加新地址
        </div>
    </div>
</template>

<script>
    import { MessageBox, Toast } from "mint-ui";
    import navBar from "@/components/navBar";
    import config from "@/assets/js/config";
    export default {
        name: "addressList",
        data() {
            return {
                addressList: []
            };
        },
        components: {
            // 2. 挂子
            navBar
        },
        created() {
            this.getAddress();
        },
        methods: {
            goback() {
                // 返回历史对象window.history.go(-1)的上一页
                this.$router.go(-1);
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
                    .get(config.api + "/address/addressList/" + userId)
                    .then(res => {
                        console.log(res.data.data);
                        this.addressList = res.data.data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            add: function () {
                this.$router.push("/addAddress");
            },
            delAdd(item) {
                MessageBox({
                    title: "温馨提示",
                    message: "您确定要删除选中产品吗？",
                    showCancelButton: true
                }).then(type => {
                    if (type == "confirm") {
                        let addressId = item._id;
                        this.$axios
                            .get(config.api + "/address/delete/" + addressId)
                            .then(res => {
                                console.log(res.data.data);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        location.reload();
                    }
                });
            },
            setDefault(item) {
                let addressId = item._id; // 对应地址编号
                if (!window.localStorage.getItem("userinfo")) {
                    MessageBox.alert("您尚未登录!").then(action => {
                        this.$router.push("/login");
                    });
                } else {
                    var userId = JSON.parse(localStorage.getItem("userinfo"))[0]._id;
                }
                this.$axios({
                    method: "get",
                    url: config.api + "/address/setDefault",
                    headers: {
                        "content-type": "application/json;charset=UTF-8"
                    },
                    params: {
                        userId: userId, // 用户编号
                        addressId: addressId // 地址编号
                    },
                    dataType: "json"
                })
                    .then(res => {
                        console.log(res.data);
                        this.goback();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            editAdd(item) {
                console.log(item);
                this.$router.push({ name: "addAddress", query: { id: item._id } });
            }
        }
    };
</script>

<style scoped lang="css">
    .navbar {
        background: linear-gradient(#eee, #ddd) !important;
        /*渐变*/
    }

    .icon-yigouxuan1 {
        color: #f00;
    }

    img {
        display: block;
        width: 100%;
    }

    .addressList .box {
        background: #f2f2f2;
    }

    .addressList .box ul {
        padding-bottom: 13px;
    }

    .addressList .box ul li {
        margin-bottom: 5px;
        background: #fff;
    }

    .addressList .box ul li>.txt {
        border: 1px solid #d7d7d7;
        height: 70px;
        padding: 15px 10px 0px;
        border-width: 1px 0 1px;
        box-sizing: border-box;
        font-size: 18px;
    }

    .addressList .box ul li>.txt .top {
        padding-bottom: 15px;
        display: flex;
    }

    .addressList .left1 {
        width: 10%;
    }

    .addressList .leftV {
        width: 20%;
    }

    .addressList .box ul li>.txt .bottom {
        line-height: 1.2;
        font-size: 14px;
        color: #999;
    }

    .addressList .box ul li .select {
        padding: 10px 20px 10px;
        border-bottom: 1px solid #d7d7d7;
    }

    .addressList .box ul li .select>div {
        display: inline-block;
        font-size: 15px;
    }

    .addressList .box ul li .select>div div img {
        height: 100%;
        width: auto;
    }

    .addressList .box ul li .select>div>div {
        display: inline-block;
        vertical-align: middle;
    }

    .addressList .box ul li .select>div.check div {}

    .addressList .box ul li .select>div .icon {
        width: 24px;
        height: 24px;
    }

    .addressList .box ul li .select>div.edit {
        margin-left: 29px;
    }

    .addressList .box ul li .select>div.delete {
        margin-left: 85px;
    }

    .addressList .btn {
        width: 100%;
        height: 60px;
        background: #ff0900;
        position: fixed;
        z-index: 100;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 20px;
        line-height: 50px;
        text-align: center;
        color: #fff;
    }
</style>