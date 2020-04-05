<template>
	<div>
		<!--头部导航-->
		<nav-bar>
			<span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
			<div slot="center">分类页</div>
			<span slot="right" class="iconfont icon-saoyisao"></span>
		</nav-bar>
		<!--tab效果-->
		<div class="tab">
			<!-- 触发广播的数据-->
			<tab-title @end="run"></tab-title>
			<tab-content :curId="curId" :catName="catName"></tab-content>
		</div>
	</div>
</template>

<script>
    // 1. 导入子组件
    import navBar from '@/components/navBar';
    import tabTitle from '@/pages/category/tabTitle';
    import tabContent from '@/pages/category/tabContent';
	export default{
		name:'category',
		data(){
			return {
				curId:null,
				catName:'标题'
			}
		},
		components:{  // 2. 挂子
			navBar,
			tabTitle,
			tabContent,
		},
		methods:{
			run(x,catName){
				this.curId = x;
				this.catName = catName;
			},
			goback(){
				// 返回历史对象window.history.go(-1)的上一页
				this.$router.go(-1);
			}
		},
		mounted(){
			// 初始化的菜单名称的事件触发
			this.$on('end',(x,catName)=>{
				this.curId = x;
				this.catName = catName;
			})
		}
	}
</script>
<style scoped>
	.navbar{
		background: linear-gradient(#eee,#ddd) !important; /*渐变*/
	}
	.tab{
		display:flex;
		height:100%;
	}
	
</style>