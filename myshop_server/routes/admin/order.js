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
router.get('/orderchangeToFinished', async (ctx, next) => {
    let orderId = ctx.request.query.orderId;
    let updateResult = await order.updateOne({ "_id": orderId }, { order_status: 40 });
    if (updateResult) {
        ctx.body = {
            success: true,
            message: "订单完成"
        }
    }
})

module.exports = router