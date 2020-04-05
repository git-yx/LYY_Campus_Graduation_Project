<template>
  <div id="app">
  	<div class="container">
  		<div class="container-body">
  			<router-view></router-view>
  		</div>
  		<!--底部-->
  		<div class="footer">
  			  <tab-bar></tab-bar>
  		</div>
  	</div>
  </div>
</template>

<script>
//1. 导入tabbar,生子
import tabBar from '@/components/tabBar'
export default {
  name: 'App',
  components:{
  	tabBar  //2.挂子
  }
}
</script>

<style>
input{
    -webkit-user-select:text !important;
}
</style>
