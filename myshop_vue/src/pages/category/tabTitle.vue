<template>
    <div>
        <ul class="tabtitle">
            <li v-for="(item,key) in titles" :key="key" :class="{active:curId==item._id}" @click="switchTab(item._id)">
                {{item.title}}
            </li>
        </ul>
    </div>
</template>
<script>
    import config from "@/assets/js/config";
    export default {
        name: "tabTitle",
        data() {
            return {
                titles: [],
                curId: null
            };
        },
        mounted() {
            this.getTitles();
        },
        methods: {
            // 获取标题
            getTitles() {
                //this.$axios.defaults.baseURL ='http://localhost:8080';
                this.$axios
                    .get(config.api + "/cats")
                    .then(res => {
                        console.log(res.data.data);
                        this.titles = res.data.data;
                        // 初始化 菜单标题的数据显示
                        let tabId ;
                        localStorage.getItem('curTitle') ? tabId = localStorage.getItem('curTitle') : tabId = this.titles[0]._id;
                        console.log('导航到分类',tabId);
                        this.switchTab(tabId);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            // 切换标题
            switchTab(id) {
                // 优化重复点击同一个标题
                if (id == this.curId) { return false }
                // 更改动态 curId
                this.curId = id;
                // 通过 _id 查找数据中对应的名称
                function getTitleById(titles, id) {
                    for (let k in titles) if (titles[k]._id == id) { return titles[k].title };
                    return "标题";
                }
                // 广播把 curId 传递给父元素
                //this.$emit('end',this.curId,this.titles[id].title);
                this.$emit("end", this.curId, getTitleById(this.titles, this.curId));
            }
        }
    };
</script>
<style scoped>
    .tabtitle {
        width: 100px;
    }

    .tabtitle li {
        text-align: center;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        font: bold 14px/35px 微软雅黑;
        cursor: pointer;
    }

    .tabtitle li.active {
        color: #ff6600;
        border-right: 0;
    }
</style>