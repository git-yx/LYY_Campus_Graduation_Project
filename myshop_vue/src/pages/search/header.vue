<template>
  <div>
    <!--头部导航 nav-bar 组件-->
    <nav-bar>
      <!--可以更改插槽坑的内容-->
      <span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
      <div class="search" slot="center">
        <i class="jd-logo"></i>
        <i class="fangd"></i>
        <input type="text" class="key" title="搜索框" placeholder="商品5折" ref="input" v-model="query">
      </div>
      <span slot="right">
        <a href="#">登录</a>
      </span>
    </nav-bar>
  </div>
</template>

<script>
import navBar from "@/components/navBar";
import debounce from "@/assets/js/util";

export default {
  name: "SearchHeader",
  data() {
    return {
      query: ""
    };
  },
  components: {
    navBar
  },
  watch: {
    query: debounce(function() {
      this.$emit("query", this.query);
    })
  },
  methods: {
    goback() {
      this.$router.back();
    }
  }
};
</script>

<style  scoped>
.header {
  border-bottom: 1px solid #ccc;
}
/*头部导航样式*/
.search {
  position: relative;
  display: flex;
  padding: 10px 0 10px 75px;

  border-radius: 20px;
  background: #fff;
}
.search .key {
  flex: 1;
  border: 0;
  font-size: 14px;
  margin-right: 10px;
  line-height:normal;
}
.search .jd-logo {
  display: inline-block;
  position: absolute;
  left: 10px;
  top: 10px;
  width: 20px;
  height: 15px;
  background: url(~@/assets/images/log.png) no-repeat;
  background-size: 20px 15px;
}
.search .fangd {
  display: inline-block;
  position: absolute;
  left: 35px;
  top: 12px;
  width: 18px;
  height: 15px;
  background: url(~@/assets/images/icon.png) no-repeat -80px 0;
  background-size: 200px;
  margin: 0 0 0 6px;
  border-left: 1px solid #ccc;
}
</style>
