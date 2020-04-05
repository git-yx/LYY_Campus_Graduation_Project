const router = require('koa-router')()
router.prefix('/order');

let tools = require('../../common/tools.js');
let order = require('../../model/orderModel');

router.get('/', async function (ctx) {
    // 连接Mongo 实现数据查询显示  调用方法  find(集合名,查询条件)
    let results = await order.find({});
    await ctx.render('admin/order/index.html', { data: results, sd: tools.formatTime() });
})

/// 更新订单状态
router.get('/admin/orderchangeToFinished', async (ctx, next) => {
    let orderId = ctx.request.query.orderId;
    let data = await order.find({ "_id": orderId });
    let json;
    if (data[0].order_status == 20) {
        json = { /*es6 属性名表达式*/
            [attr]: 40
        };
    } else {
        json = {
            [attr]: 20
        };
    }
    let updateResult = await order.updateOne({ "_id": orderId }, json);
    if (updateResult) {
        ctx.body = {
            success: true,
            message: "订单完成"
        }
    }
})

module.exports = router