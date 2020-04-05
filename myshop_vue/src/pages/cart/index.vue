<template>
  <div class="page">
    <!--购物车navbar 导航-->
    <nav-bar>
      <span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
      <div slot="center">购物车</div>
      <span slot="right" class="iconfont icon-saoyisao"></span>
    </nav-bar>
    <!--没商品的页面-->
    <div v-if="!hasProduct" class="no-cart">
      <img src="@/assets/images/no-cart.png" style="width:100px;"/>
      <p class="no-cart-p">
        你的购物车还是空的
        <br>
        <br>
        <mt-button type="danger" size="normal" @click="gohome">到首页</mt-button>
      </p>
    </div>
    <!--有商品的页面-->
    <div v-if="hasProduct" class="has-cart">
      <!--<i class="iconfont" :class="mycheck?'icon-yigouxuan':'icon-weigouxuan'"></i>-->
      <h3>买买网专营店</h3>
      <ul class="my-addList">
        <li class="my-item" v-for="(shop,key) in shopCart" :key="key">
          <div class="mycheckbox" @click="touchOne(shop)">
            <i class="iconfont" :class="shop.isSelect?'icon-yigouxuan':'icon-weigouxuan'"></i>
          </div>
          <div class="image">
            <img :src="`${url}/${shop.goods_img.split(',')[0]}`" />
          </div>
          <div class="info">
            <p class="title">{{shop.title}}</p>
            <p class="price">¥{{shop.market_price}}</p>
          </div>
          <div class="productNum">
            <span class="reduce" @click="reduce(shop)">-</span>
            <span class="num">{{shop.num}}</span>
            <span class="plus" @click="plus(shop)">+</span>
          </div>
          <div class="del">
            <button @click="del(shop,key)">删除</button>
          </div>
        </li>
      </ul>
      <!--结算-->
      <div class="calc">
        <p class="chooseAll" @click="setChooseAll()">
          <i class="iconfont" :class="chooseAll?'icon-yigouxuan':'icon-weigouxuan'"></i>
          <span>全选</span>
        </p>
        <p class="price">
          <span>总计价格:</span>
          <span class="total">¥{{calc.total}}</span>
        </p>
        <p class="order" @click="goConfirm">结算({{calc.count}}件)</p>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import navBar from "@/components/navBar";
import config from "@/assets/js/config";
// 导入 GoodTool 文件
import GoodTool from "@/assets/js/GoodTool";
export default {
  name: "cart",
  data() {
    return {
      hasProduct: false,
      chooseAll: true,
      shopCart: [],
      orderGoodList: [],
      url: config.api
    };
  },
  components: {
    navBar
  },
  computed: {
    calc() {
      // 商品的总个数
      // 总价格
      let count = 0;
      let total = 0;
      let orderGoodList = [];
      this.shopCart.forEach(shop => {
        // 必须是勾选的商品
        if (shop.isSelect == true) {
          count += shop.num;
          // 单个商品的小计= 单个商品的价格* 数量  shop.priceDiscount * shop.num
          total += shop.market_price * shop.num;

          // 3. 构建预处理订单数据对象
          orderGoodList.push(shop);
          console.log(total);
        }
      });
      this.orderGoodList = orderGoodList;
      console.log(this.orderGoodList);
      return {
        count,
        total
      };
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    gohome() {
      // 路由跳转
      //this.$router.push("/home");
      this.$router.push("{path:'/home'}");
    },
    // 获得多个商品数据
    getCartProducts() {
      // axios 调用数据(通过 addGoods 本地存储 去调用多个购物车商品)
      let addGoods = JSON.parse(localStorage.getItem("addGoods")) || [];
      if (addGoods != 0) {
        // 判断是否有商品如果有 ,修改有商品的变量值
        this.hasProduct = true;
        let itemIds = "";
        for (let i = 0; i < addGoods.length; i++) {
          itemIds += addGoods[i].id + ",";
        }
        //console.log(itemIds);
        this.$axios
          .get(config.api + "/item/queryItems?itemIds=" + itemIds)
          .then(res => {
            this.shopCart = res.data.data;
            // 3. 在 axios 数据调用中 获得  循环遍历shopCart每个商品 中添加两组 键值对
            for (let i = 0; i < this.shopCart.length; i++) {
              let shop = this.shopCart[i]; // 每个商品对象数据

              // 从本地存在中通过 编号获得(shop.id) 对应的 商品数量num
              let num = GoodTool.getCartNumById(addGoods, shop._id);

              this.$set(shop, "num", num);
              this.$set(shop, "isSelect", true);
              console.log(shop);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    // 通过点击更改单个商品的勾选状态
    touchOne(shop) {
      // 4.1 修改  this.shopCart 中对应的商品的 shop.isSelect 状态
      shop.isSelect = !shop.isSelect;

      // 6.判断商品的种类总个数(this.shopCart.length)
      // 是否与 勾选的商品种类的个数相同吗(（循环遍历）如果相同this.chooseAll=true 否则相反)
      let selectedCount = 0;
      for (let i = 0; i < this.shopCart.length; i++) {
        if (this.shopCart[i].isSelect == true) {
          selectedCount++;
        }
      }
      if (this.shopCart.length == selectedCount) {
        this.chooseAll = true;
      } else {
        this.chooseAll = false;
      }
    },
    // 5全选勾选
    setChooseAll() {
      // 5修改  全选框 自己的 this.chooseAll 状态
      this.chooseAll = !this.chooseAll;
      //5 循环遍历this.shopCart 让每个商品 shop.isSelect 都与 this.chooseAll 的状态一致
      for (let i = 0; i < this.shopCart.length; i++) {
        let shop = this.shopCart[i]; //每个商品
        shop.isSelect = this.chooseAll;
      }
    },
    // 减商品
    reduce(shop) {
      if (shop.num == 1) {
        return false;
      } else {
        shop.num--;
      }

      // 修改 状态管理中的 state 的 num数量
      this.$store.dispatch("addShopNumAction", -1);

      //修改本地存储
      let addGoods = [];
      let addGoodOne = null;
      this.shopCart.forEach(shop => {
        addGoodOne = {
          id: shop._id,
          num: shop.num
        };
        addGoods.push(addGoodOne);
      });
      localStorage.removeItem("addGoods");
      localStorage.setItem("addGoods", JSON.stringify(addGoods));
    },
    // 加商品
    plus(shop) {
      shop.num++;

      // 修改 状态管理中的 state 的 num数量
      this.$store.dispatch("addShopNumAction", 1);

      //修改本地存储
      let addGoods = [];
      let addGoodOne = null;
      this.shopCart.forEach(shop => {
        addGoodOne = {
          id: shop._id,
          num: shop.num
        };
        addGoods.push(addGoodOne);
      });
      localStorage.removeItem("addGoods");
      localStorage.setItem("addGoods", JSON.stringify(addGoods));
    },
    del(shop, index) {
      MessageBox.alert("删除成功").then(action => {
        // 1. 删除   循环遍历的  shopCart 对应的商品
        this.shopCart.splice(index, 1);
        // 2. 状态管理  state 中 num 修改
        let num = shop.num;
        this.$store.dispatch("addShopNumAction", -num);

        // 3. 修改(删除对应商品) 本地存储 addGoods 商品
        let addGoods = JSON.parse(localStorage.getItem("addGoods")) || [];
        addGoods.splice(index, 1);
        localStorage.setItem("addGoods", JSON.stringify(addGoods));

        // 刷新页面
        location.reload(); //this.$router.go(0);
      });
    },
    // 用户前往结算页面确认订单进行支付
    goConfirm() {
      // 判断用户是否登录？
      if (this.calc.total <= 0) {
        //alert("请至少选择一个产品去结算");
        MessageBox.alert("至少选一个商品");
      } else if (!window.localStorage.getItem("userinfo")) {
        MessageBox.alert("您尚未登录!").then(action => {
          this.$router.push("/login");
        });
      } else {
        // 将预处理订单数据存入到本地缓存中
        window.localStorage.setItem(
          "orderGoodList",
          JSON.stringify(this.orderGoodList)
        );
        // 跳转到确认订单页中
        this.$router.push("/confirmOrder");
      }
      // TODO: 购买商品之前需要判断当前用户是否登录
      //this.$router.push("/confirmOrder");
    }
  },
  mounted() {
    this.getCartProducts();
  }
};
</script>
<style scoped>
.navbar {
  background: linear-gradient(#eee, #ddd) !important; /*渐变*/
}
/*没商品的样式*/
.no-cart {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 100px 0 10px;
}
.no-cart-p {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0px 0 10px;
}
.no-cart img {
  width: 50%;
  height: 50%;
}
.no-cart p {
  padding: 30px 0;
  font: 20px 微软雅黑;
}
.has-cart {
  padding: 10px;
}
.has-cart h3 {
  padding: 10px 0;
  font: bold 14px 微软雅黑;
}
.my-item {
  display: flex;
  height: 78px;
  margin-bottom: 10px;
}
.mycheckbox {
  width: 10%;
  text-align: center;
  line-height: 60px;
}
.image {
  width: 20%;
}
.image img {
  width: 100%;
  height: 100%;
}
.info {
  width: 40%;
  padding: 0 6px;
  font: 12px/20px 微软雅黑;
}
.info .price {
  color: #f00;
}
.productNum {
  width: 20%;
  display: flex;
  align-items: center;
}
.reduce,
.plus {
  display: inline-block;
  width: 20px;
  height: 15px;
  border: 1px solid #ccc;
  background: #eee;
  text-align: center;
  line-height: 15px;
}
.num {
  display: inline-block;
  width: 15px;
  height: 15px;
  font-size: 12px;
  text-align: center;
}
.del {
  width: 10%;
}
.del button {
  display: inline-block;
  height: 60px;
  border: 0;
  background: #f00;
  color: #fff;
  padding: 0 3px;
}
/*底部 结算*/
.calc {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  z-index: 9999 !important;
  line-height: 60px;
  padding: 0 0 0 10px;
}
.chooseAll {
  width: 20%;
}
.price {
  width: 50%;
}
.price .total {
  color: #f00;
}
.order {
  width: 30%;
  height: 60px;
  background: #f00;
  text-align: center;
  color: #fff;
}
</style>