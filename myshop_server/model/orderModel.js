const mongoose = require('./db.js')
const Schema = mongoose.Schema;
const d = new Date();
const orderSchema = new Schema({
    uid: { type: Schema.Types.ObjectId }, // 用户编号
    all_price: { type: Number },  // 总价格
    order_id: { type: String },   // 订单号
    name: { type: String },    // 收件人
    phone: { type: Number },   //电话
    address: { type: String }, //地址
    zipcode: { type: String },  // 邮编
    pay_status: {
        type: Number,
        default: 0
    },   // 支付状态： 0 表示未支付     1 已经支付
    pay_type: { type: String },      // 支付类型： alipay    wechat  
    //  10 待付款(已下单) 20 待收货(已付款)  30 物流（发货） 40已完成（交易成功）  50 取消  60 退货
    order_status: {               // 订单状态： 0 已下单  1 已付款  2 已配货  3、发货   4、交易成功   5、退货     6、取消      
        type: Number,
        default: 10
    },
    add_time: {
        type: Number,
        default: d.getTime()
    }
});

module.exports = mongoose.model('Order', orderSchema, 'order');
