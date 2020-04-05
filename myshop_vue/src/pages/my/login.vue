<!--登录页-->
<template>
    <div>
        <!-- 头部导航 nabbar -->
        <nav-bar>
            <span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
            <div slot="center">分类页</div>
            <span slot="right" class="iconfont icon-saoyisao"></span>
        </nav-bar>
        <main class="user_login_box">
            <div class="login_dialog" id="login">
                <div class="_username">
                    <input type="text" placeholder="请输入用户名" class="user_input" v-model="phone" id="phone" />
                </div>
                <div class="_username u_passwd">
                    <input type="password" placeholder="请输入密码" class="user_input" v-model="pass" id="code" />
                </div>

                <div class="login_box">
                    <button @click="login()" class="btn_login">登录</button>
                </div>
                <div class="go_reg_box">
                    <div>注册了才能使用哦,未注册用户会自动注册成新用户~</div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import { MessageBox } from "mint-ui";
    import navBar from "@/components/navBar";
    import config from "@/assets/js/config";
    export default {
        components: { navBar },
        data() {
            return {
                phone: "", //手机
                pass: "" //密码
            };
        },
        methods: {
            goback() {
                return this.$router.push("/home");
            },
            testPhone(phone) {
                return /^1[1|3|4|5|7|8][0-9]{9}$/.test(phone);
            },
            login() {
                this.$axios({
                        method: "post",
                        url: config.api + "/dologin",
                        data: {
                            username: this.phone,
                            password: this.pass
                        },
                        withCredentials: true,
                        dataType: "json"
                    })
                    .then(res => {
                        console.log(res.data)
                        if (res.data.success) {
                            localStorage.setItem( "userinfo", JSON.stringify(res.data.userinfo) );
                            MessageBox.alert(res.data.msg).then(action => { this.$router.go(-1) });
                        }else{
                            MessageBox.alert(res.data.msg)
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

    body {
        background-color: #f3f5f7;
    }

    .user_login_box {
        max-width: 640px;
        min-width: 300px;
        margin: 0 auto;
        height: 200px;
        padding-top: 40px;
    }

    .user_login_box .login_dialog {
        width: 100%;
        height: 100%;
        padding: 10px;
    }

    .login_dialog ._username {
        height: 50px;
        width: 100%;
        background-color: #fff;
        margin-top: 20px;
        border: 1px solid #bebebe;
        border-radius: 2px;
    }

    ._username .user_input {
        width: 100%;
        height: 100%;
        font-size: 16px;
        padding-left: 6px;
    }

    .login_dialog .u_passwd {
        margin-top: 10px;
    }

    .login_dialog .login_box {
        height: 50px;
        width: 100%;
        background-color: #f23030;
        border-radius: 4px;
        margin-top: 30px;
    }

    .login_box button {
        display: block;
        width: 100%;
        height: 100%;
        line-height: 50px;
        text-align: center;
        color: #fff;
        background-color: #f23030;
    }

    .go_reg_box {
        float: right;
    }

    .go_reg_box span {
        display: inline-block;
        color: #aaa;
        height: 20px;
        line-height: 20px;
        margin-top: 10px;
    }
</style>