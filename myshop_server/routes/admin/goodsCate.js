const router = require('koa-router')()
router.prefix('/goodsCate');

let tools = require('../../common/tools.js');
let goodsCate = require('../../model/goodsCateModel.js');

router.get('/', async function (ctx) {
    // 连接Mongo 实现数据查询显示  调用方法  find(集合名,查询条件)
    let results = await goodsCate.find({});
    await ctx.render('admin/goodsCate/index.html', { data: results, sd: tools.formatTime() });
})

// 添加
router.get('/add', async function (ctx) { await ctx.render('admin/goodsCate/add.html') })

// 执行添加
router.post('/doadd', async function (ctx) {
    const { title, sort } = ctx.request.body
    let cate = new goodsCate({
        title,
        sort
    })
    let addResult = await cate.save();
    console.log(addResult)
    ctx.redirect('/admin/goodsCate');
})

// 跳转更新页面
router.get('/edit', async function (ctx) {
    let _id = ctx.request.query._id;
    let result = await goodsCate.find({ _id });
    await ctx.render('admin/goodsCate/edit.html', { dataone: result[0] });
})

// 执行更新
router.post('/doEdit', async (ctx) => {
    const { _id, title, sort, status } = ctx.request.body;
    let updateResult = await goodsCate.updateOne({ _id }, { title, sort, status });
    console.log(updateResult)
    ctx.redirect('/admin/goodsCate');
})

module.exports = router