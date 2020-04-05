let obj ={}

obj.getCartNumById= function(addGoods,index){
	// 通过 编号 找对应的商品数量
	for(let i = 0; i<addGoods.length;i++){
		if(addGoods[i].id == index){
			
			return addGoods[i].num;
		}
	}
}


export default obj;
