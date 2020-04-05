const router = require('koa-router')()
router.prefix('/manager')

// mongoose 对象中 数据manager表的模型对象
let managerModel = require('../../model/managerModel');
let tools = require('../../common/tools.js');

// 获取管理员列表
router.get('/', async function (ctx, next) {
    // 连接Mongo 实现数据查询显示  调用方法  find(集合名,查询条件)
    let results = await managerModel.find({});
    await ctx.render('admin/manager/index.html', { data: results, sd: tools.formatTime() })
})

// 添加
router.get('/add', async (ctx) => { await ctx.render('admin/manager/add') })

router.post('/doAdd', async (ctx) => {
    const { username, password, mobile } = ctx.request.body;
    let manager = new managerModel({
        username,
        password,
        mobile
    })
    let addResult = await manager.save();  //添加
    console.log(addResult);
    ctx.redirect('/admin/manager');
})

// 跳转修改页修改
router.get('/edit', async (ctx) => {
    let _id = ctx.query._id;
    let result = await managerModel.find({ "_id": _id });
    await ctx.render('admin/manager/edit', { dataone: result[0] })
})

// 执行修改
router.post('/doEdit', async (ctx) => {
    const { _id, password, mobile } = ctx.request.body;
    let updateResult = await managerModel.updateOne({ _id }, { password, mobile });
    console.log(updateResult);
    ctx.redirect('/admin/manager');
})

// 删除
router.get('/del', async (ctx) => {
    let _id = ctx.request.query._id;
    console.log(_id);
    let delResult = await managerModel.deleteOne({ "_id": _id });
    ctx.redirect('/admin/manager');
})

module.exports = router