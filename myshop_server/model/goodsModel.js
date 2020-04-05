const mongoose = require('./db.js')

const Schema = mongoose.Schema;

const d = new Date();
const GoodsSchema = new Schema({
    title: { type: String, default: '' },  // 产品名称
    sub_title: { type: String, default: '' },// 产品子标题
    cate_id: { type: Schema.Types.ObjectId },  // 两表关联  分类id    
    click_count: {       //点击量       
        type: Number,
        default: 100
    },
    goods_number: {      // 库存   
        type: Number,
        default: 1000
    },
    shop_price: {   // 商品打折价
        type: Number,
        default: 0
    },
    market_price: {   // 商品原价格
        type: Number,
        default: 0
    },
    goods_img: {    // 商品图像   upload/20191111/xxx.jpg,upload/20191111/zzz.jpg,upload/20191111/ttt.jpg
        type: String,
        default: ''
    },
    goods_size: {   // 商品尺寸  S,M,L,XL,XXL
        type: String,
        default: ''
    },
    goods_color: {  // 颜色  blue,green,red
        type: String,
        default: ''
    },
    goods_keywords: { // 商品关键词
        type: String,
        default: ''
    },
    goods_content: {  // 商品内容
        type: String,
        default: ''
    },
    sort: { type: Number, default: 100 },   //商品排序
    is_hot: {        // 热卖商品
        type: Number,
        default: 0
    },
    is_best: {      // 精品商品
        type: Number,
        default: 0
    },
    is_new: {      // 最新商品
        type: Number,
        default: 0
    },
    status: { type: Number, default: 1 },     // 状态 0 1
    add_time: {            //创建时间
        type: Number,
        default: d.getTime()
    }

});
module.exports = mongoose.model('Goods', GoodsSchema, 'goods');