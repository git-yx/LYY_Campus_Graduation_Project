<template>
  <div>
    <transition name="search">
      <div class="search">
        <header class="g-header-container">
          <search-header @query="getQuery"/>
        </header>
      </div>
    </transition>
    <search-history ref="history" v-show="!query" @show-confirm="showConfirm"/>
    <search-result :query="query" v-show="query"/>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import SearchHeader from "./header";
import SearchHistory from "./history";
import SearchResult from "./result";

export default {
  name: "search",
  components: {
    SearchHeader,
    SearchHistory,
    SearchResult
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    getQuery(query) {
      this.query = query;
      console.log(this.query);
    },
    showConfirm() {
      MessageBox.alert("清空历史数据成功").then(action => {
        this.$refs.history.clear();
        location.reload();
      });
    }
  }
};
</script>

<style lang="css" scoped>
.search-enter-active,
.search-leave-active {
  transition: all 0.3s;
}

.search-enter,
.search-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
