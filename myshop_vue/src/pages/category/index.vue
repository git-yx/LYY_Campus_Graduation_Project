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

        <!-- 评测部分 -->
        <div class="pingce">
            <div class="pchead">                
                <div class="pc">产品评测</div>
                <div class="upload" @click="toPc">我要上传</div>
            </div>
            <div class="pc-content" v-for="(item,index) in cmtlist" :key="index">
                <div class="left">
                    <img src="/static/img/mypic.5c02a4b.jpg" alt="" class="left-img">
                </div>
                <div class="right">
                    <div class="user">{{item.phone}}</div>
                    <div class="time">{{item.add_time | getLocalTime}}</div>
                    <div class="kh">{{item.title}}</div>
                    <div class="cmt">{{item.cmt}}</div>
                    <img :src="config.api + '/' +pic" alt="" class="cmt-img" v-for="(pic, i) in item.imgList" :key="i">
                </div>
            </div>
        </div>
	</div>
</template>
<script>
    // 1. 导入子组件
    import navBar from '@/components/navBar';
    import tabTitle from '@/pages/category/tabTitle';
    import tabContent from '@/pages/category/tabContent';
    import config from "@/assets/js/config";
	export default{
		name:'category',
		data(){
			return {
				curId:null,
                catName:'标题',
                curItem: null,
                cmtlist: [],
                config: config
			}
		},
		components:{  // 2. 挂子
			navBar,
			tabTitle,
			tabContent,
		},
		mounted(){
			// 初始化的菜单名称的事件触发
			this.$on('end',(x,catName)=>{
				this.curId = x;
                this.catName = catName;
			})
        },
        filters:{
            getLocalTime(timestamp) {     
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                return Y+M+D+h+m+s;   
            }
        },
		methods:{
            toPc(){
                this.$router.push({name: 'cmtUpload', params: { curItem: this.curItem }});
            },
			run(x,catName,item){
                console.log('当前菜单',item)
				this.curId = x;
				this.catName = catName;
                this.curItem = item;
                // 获取评测
                this.getCmt(item._id);
            },
            getCmt(_id){
                this.$axios.get(config.api + "/cmt/get?brandId="+ _id)
                .then( (res) => {
                    if(res.data.success){
                        this.cmtlist = res.data.data;
                        console.log('评测数据',this.cmtlist)
                    }else this.cmtlist = []
                })
                
            },
			goback(){
				// 返回历史对象window.history.go(-1)的上一页
				this.$router.go(-1);
			}
		},
	}
</script>

<style scoped>
    .pingce{
        padding: 0 10px ;
        border-top: 5px solid #000;
        margin-top: 15px;
    }
    .pchead{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .pc{
        font-size: 16px;
        font-weight: bold;
    }
	.upload{
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        font-weight: bold;
    }
    .pc-content{
        overflow: hidden;
        margin: 10px 0;
        border-bottom: 1px solid #000;
    }
    .left{
        width: calc(25% - 5px);
        float: left;
        display: flex;
        justify-content: center;
    }
    .left-img{
        width: 60px;
        height: 60px;
        border-radius: 100%;
    }
    .right{
        width: calc(75% - 5px);
        float: left;
    }
    .user{
        font-size: 14px;
        color: red;
        font-weight: bold;
    }
    .time{
        color: gray;
    }
    .kh{
        font-size: 15px;
        font-weight: bold;
    }
    .cmt{

    }
    .cmt-img{
        width: 50px;
        height: 50px;
    }
	.navbar{
		background: linear-gradient(#eee,#ddd) !important; /*渐变*/
	}
	.tab{
		display:flex;
		height:100%;
	}
</style>