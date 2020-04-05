<template>
    <div class="tabbar">
        <router-link to="/home" class="item item-active">
            <i class="iconfont icon-shouye"></i>
            <span>首页</span>
        </router-link>
        <router-link to="/category" class="item">
            <i class="iconfont icon-fenlei"></i>
            <span>分类</span>
        </router-link>
        <router-link to="/cart" class="item">
            <i class="iconfont icon-icon-test1"></i>
            <span>
                购物车
                <!-- <mt-badge size="small" color="#f00">{{pickNum}}</mt-badge> -->
            </span>
        </router-link>
        <router-link to="/my" class="item">
            <i class="iconfont icon-wode"></i>
            <span>我的</span>
        </router-link>
    </div>
</template>
<script>
    export default {
        name: "tabBar",
        computed: {
            pickNum() {
                // 获得状态管理 num
                return this.$store.getters.getShopNum;
            }
        }
    };
</script>
<style scoped>
    /*tabbar样式*/
    .tabbar {
        width: 100%;
        height: 60px !important;
        /*高子项可以拉伸继承*/
        display: flex;
        justify-content: space-between;
    }

    .tabbar .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .tabbar span {
        margin-top: 3px;
    }

    .tabbar a.router-link-active {
        color: #f60;
    }
</style>