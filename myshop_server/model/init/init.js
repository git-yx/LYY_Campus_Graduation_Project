const addressModel = require('../addressModel');
const focusModel = require('../focusModel');
const goodsCateModel = require('../goodsCateModel');
const goodsImageModel = require('../goodsImageModel');
const goodsModel = require('../goodsModel');
const managerModel = require('../managerModel');
const orderItemModel = require('../orderItemModel');
const orderModel = require('../orderModel');
const setting = require('../setting');
const userLikeModel = require('../userLikeModel');
const userModel = require('../userModel');

exports.addAddress = new addressModel({
    uid: '5e88a3f7ce144c172b8c4d19',
    name: "叶泫",
    phone: 17695796264,
    province: "天津",
    city: "天津市",
    district: "西青区",
    addressInfo: "津静公路26号",
    default_address: 1
})
exports.addFocus = new focusModel({
    title: '喵喵喵',
    focus_img: "https://www.baidu.com/img/bd_logo1.png",
    link: "https://www.baidu.com/img/bd_logo1.png",
    sort: 1,
    status: 1
})
exports.addGoodsCate = new goodsCateModel({
    title: '喵喵喵'
})
exports.addGoodsImage = new goodsImageModel({
    goods_id: null,
    img_url: "https://www.baidu.com/img/bd_logo1.png"
})
exports.addGood = new goodsModel({
    title: "喵喵喵",
    sub_title: "副标题",
    cate_id: null
})
exports.addOrderItem = new orderItemModel({
    uid: "5e88a3f7ce144c172b8c4d19",
    order_id: null,
    product_title: "商品标题",
    product_id: null,
    product_img: "https://www.baidu.com/img/bd_logo1.png",
    product_price: 100,
    product_num: 100
})
exports.addOrder = new orderModel({
    uid: "5e88a3f7ce144c172b8c4d19",
    all_price: 1000,
    order_id: null,
    name: "叶泫",
    phone: 17695796264,
    address: "天津市西青区天津城建大学",
    zipcode: 325200,
    pay_type:"wechat"
})
exports.addManager = new managerModel({
    username: 'yexuan',
    password: 123,
    mobile: 17695796264,
    status: 1
})
// exports.addSetting = new setting({
//     site_title: '爱上口红',
//     site_logo: "https://www.baidu.com/img/bd_logo1.png",
//     site_keywords: "口红",
//     site_description: "来买口红吧",
//     no_picture: "lala",
//     site_icp: "啦啦啦",
//     site_tel: "10101",
//     search_keywords: "口红",
//     tongji_code: "啦啦"
// })
exports.addUserLike = new userLikeModel({
    userId: '5e88a3f7ce144c172b8c4d19',
    itemId: null,
    sort: 100,
    status: 1
})
exports.addUser = new userModel({
    password: '123',
    phone: 17695796264,
    last_ip: "192.168.0.1"
})