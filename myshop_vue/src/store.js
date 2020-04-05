// 1. 在 store.js 中导入  vuex 状态管理库  
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 2. 实例化对象

export default new Vuex.Store({
	// 五大对象
	// 1. state :定义变量对象
	state:{
		num:0
	},
	// 2. getters： 获得 state的返回值,计算属性
	getters:{
		getShopNum(state){
			return state.num;
		}
	},
	// 3. mutations:普通方法，只能写同步代码
	mutations:{
		addShopNum(state,count){
			state.num += count;
		},
		changeShopNum(state,count){
			// 修改值
			state.num = count;
		}
	},
	// 4. actions: 封装 mutations,能写异步代码
	actions:{
		addShopNumAction({commit},count){
			commit('addShopNum',count);
		},
		changeShopNumAction({commit},count){
			commit('changeShopNum',count);
		}
	}
})
