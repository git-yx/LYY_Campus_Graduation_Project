<template>
  <div class="result">
    <ul class="g-list" v-show="results.length">
      <li
        class="g-list-item"
        v-for="(item, index) in results"
        :key="index"
        @click="$_search_selectItem(item)"
      >
        <router-link :to="'/productDetail/'+item._id" class="link">
          <img :src="`${url}/${item.goods_img.split(',')[0]}`" width="80">
          <span class="g-list-text">{{item.title}}</span>
        </router-link>
      </li>
    </ul>
    <div class="no-result" v-show="!results.length">没有结果</div>
  </div>
</template>

<script>
import config from "@/assets/js/config";
export default {
  name: "SearchResult",
  data() {
    return {
      results: [],
      url: ""
    };
  },
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  watch: {
    query(query) {
      this.getResults(query);
    }
  },
  methods: {
    $_search_selectItem(item) {
      var keyword = item.goods_keywords.split(",");

      let keywords = JSON.parse(localStorage.getItem("historys")) || [];

      if (keywords.length !== 0) {
        keywords = keywords.filter(val => val !== keyword);
      }
      for (var key in keyword) {
        keywords.unshift(keyword[key]);
      }

      localStorage.setItem("historys", JSON.stringify(keywords));

      this.$router.push("/productDetail/" + item._id);
    },
    getResults(keyword) {
      if (!keyword) {
        return;
      }
      this.$axios
        .get(config.api + "/index/search?keyword=" + keyword)
        .then(res => {
          //console.log(res.data.data);
          this.results = res.data.data;
          console.log(this.results);
          this.url = config.api;
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style lang="" scoped>
</style>
