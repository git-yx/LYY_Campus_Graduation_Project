<template>
  <div class="history" v-if="historys.length">
    <h4 class="history-title">历史搜索</h4>
    <transition-group class="g-list" name="list" tag="ul">
      <li class="g-list-item" v-for="item in historys" :key="item">
        <span class="g-list-text">{{item}}</span>
        <i class="iconfont icon-guanbi history-i"  @click.stop="removeItem(item)"></i>
      </li>
    </transition-group>
    <a href="javascript:;" class="history-btn" @click="showConfirm">
      <i class="iconfont icon-clear"></i>清空历史搜索
    </a>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  data() {
    return {
      historys: []
    };
  },
  created() {
    this.getKeyword();
  },
  methods: {
    update() {
      this.getKeyword();
    },
    getKeyword() {
      this.historys = JSON.parse(localStorage.getItem("historys")) || [];
    },
    removeItem(item) {
      this.historys = this.historys.filter(val => val !== item);
      localStorage.setItem("historys", JSON.stringify(this.historys));
    },
    showConfirm() {
      this.$emit("show-confirm");
    },
    clear() {
      localStorage.removeItem("historys");
    }
  }
};
</script>

<style lang="scss" scoped>
.history {
  padding-bottom: 30px;
  background-color: #fff;
}
.history-title {
  height: 34px;
  line-height: 34px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: bold;
}

.history-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 40px;
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0 auto;
  color: #686868;
}
.iconfont {
  margin-right: 5px;
}
.g-list {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}

.list-enter-active,
.list-leave-active {
  transition: height 0.1s;
}
.list-enter,
.list-leave-to {
  height: 0;
}
.history-i{
    position: absolute;
    right: 10px;
    font-size: 8px;
    color: red;
    margin: 3px;
}
</style>
