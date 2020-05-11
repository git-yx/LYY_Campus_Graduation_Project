<template>
	<div>
		<!--头部导航-->
		<nav-bar>
			<span slot="left" class="iconfont icon-fanhui" @click="goback"></span>
			<div slot="center">添加评测</div>
			<span slot="right" class="iconfont icon-saoyisao"></span>
		</nav-bar>

		<mt-field label="选择口红" placeholder="点击选择" v-model="kh" disabled @click.native="sheetVisible = true"></mt-field>
        <mt-field label="评测内容" placeholder="请输入评测内容" type="textarea" v-model="cmt"></mt-field>

        <div class="upload">
            <input type="file" id="inputimg" name="goods_img" multiple class="file">
            <!-- <div class="upimg">
                <input type="file" id="inputimg" placeholder="+" value="+" name="goods_img" multiple>
            </div>
            <template>
                <div class="upimg">
                    <img src="/static/img/mypic.5c02a4b.jpg" alt="" class="upimg-img">
                </div>
            </template>             -->
        </div>
        
        <mt-button type="primary" style="width:100vw;position:absolute;bottom:100px" @click.native="submit">添加评测</mt-button>

        <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
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
                curBrand: null,
                kh: null,
                cmt: null,
                sheetVisible: false,
                actions: [],
                imglist: [1]
			}
		},
		components:{  // 2. 挂子
			navBar,
			tabTitle,
			tabContent,
		},
		mounted(){
            this.curBrand = this.$route.params.curItem._id;
            this.getList(this.curBrand);
		},
		methods:{
            submit(){
                let file = document.getElementById('inputimg').files;
                // console.log(JSON.parse(localStorage.getItem("userinfo"))[0].phone,this.curBrand ,this.kh, this.cmt, file)
                let formData = new FormData();
                for (let i = 0; i < file.length; i++) {
                    const item = file[i];
                    formData.append('goods_img',item);
                }
                formData.append('phone', JSON.parse(localStorage.getItem("userinfo"))[0].phone);
                formData.append('brandId', this.curBrand);
                formData.append('title', this.kh);
                formData.append('cmt', this.cmt);
                this.$axios.post(config.api + "/cmt/doadd", formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(function (res) {
                   if(res.data.success) history.back(-1);
                })
            },
            getList(curid){
                    this.$axios
                    .get(config.api + "/items/searchByCat?catId=" + curid)
                    .then((res) => {
                        let arr = [];
                        if(res.data.data.length > 0){
                            res.data.data.forEach(item => {
                                arr.push({ name: item.title, method: this.choose });
                            })
                            this.actions = arr;
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    }); 
            },
            choose({name}){this.kh = name;},
			goback(){
				// 返回历史对象window.history.go(-1)的上一页
				this.$router.go(-1);
			}
		},
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
    .upload{
        width: 100%;
        height: 50px;
        background-color: #fff;
        display: flex;
        align-items: center;
    }
    .file{
        font-size: 16px;
    }
    .upimg{
        background-color:grey;
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
    }
    .upimg-img{
        width: 100px;
        height: 100px;
    }
</style>