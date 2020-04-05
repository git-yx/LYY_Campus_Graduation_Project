<template>
    <div class="navbar">
        <!--插槽-->
        <div class="left">
            <slot name="left">左</slot>
        </div>
        <div class="center">
            <slot name="center">中</slot>
        </div>
        <div class="right">
            <slot name="right">右</slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: "navBar"
    };
</script>
<style scoped>
    .navbar {
        width: 100%;
        height: 60px;
        background: #900;
        display: flex;
        text-align: center;
        align-items: center;
    }

    .navbar .left {
        width: 60px;
    }

    .navbar .left img {
        width: 50%;
        height: 50%;
    }

    .navbar .center {
        flex: 1;
        font-size: 14px;
    }

    .navbar .right {
        width: 60px;
    }

    .navbar .right a {
        color: #fff;
        font-size: 16px;
    }
</style>