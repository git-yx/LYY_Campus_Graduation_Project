const router = require('koa-router')()
router.prefix('/focus');

const tools = require('../../common/tools.js');
const focus = require('../../model/focusModel.js');

//图片上传模块
const multer = require('koa-multer');
let storage = multer.diskStorage({
    destination: 'public/upload/' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate(),
    filename: function (req, file, cb) {   /*图片上传完成重命名*/
        let fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
let upload = multer({ storage });

// 轮播图首页
router.get('/', async function (ctx) {
    // 连接Mongo 实现数据查询显示  调用方法  find(集合名,查询条件)
    let results = await focus.find({});
    await ctx.render('admin/focus/index.html', { data: results, sd: tools.formatTime() });
})

// 添加
router.get('/add', async function (ctx) { await ctx.render('admin/focus/add.html') })

// 执行添加
router.post('/doadd', upload.single('focus_img'), async function (ctx) {
    if (ctx.req.file == undefined || ctx.req.file == null) {
        await ctx.render('admin/error.html', { message: '图像必须上传', redirectUrl: '/admin/focus/add' });
    } else {
        let focus_img = ctx.req.file.path.substr(7).replace(/\\/g, '/');
        let title = ctx.req.body.title;
        let link = ctx.req.body.link;
        let sort = ctx.req.body.sort;
        let myFocus = new focus({
            title,
            focus_img,
            link,
            sort
        })
        await myFocus.save();
        ctx.redirect('/admin/focus');
    }
})

// 更新
router.get('/edit', async function (ctx) {
    let id = ctx.request.query._id;
    console.log(id);
    let result = await focus.find({ _id: id });
    await ctx.render('admin/focus/edit.html', { dataone: result[0] });
})

// 执行更新
router.post('/doEdit', upload.single('focus_img'), async (ctx) => {
    // 没有图片
    if (ctx.req.file == "undefined" || ctx.req.file == "null") {
        // 不修改图像
        let _id = ctx.req.body._id;
        let title = ctx.req.body.title;
        let link = ctx.req.body.link;
        let sort = ctx.req.body.sort;
        let status = ctx.req.body.status;
        let updateResult = await focus.updateOne({ "_id": _id }, { "title": title, "link": link, "sort": sort, "status": status });
    } else {
        let focus_img = ctx.req.file.path.substr(7).replace(/\\/g, '/');
        let _id = ctx.req.body._id;
        let title = ctx.req.body.title;
        let link = ctx.req.body.link;
        let sort = ctx.req.body.sort;
        let status = ctx.req.body.status;
        let updateResult = await focus.updateOne({ "_id": _id }, { "title": title, "focus_img": focus_img, "link": link, "sort": sort, "status": status });
    }
    ctx.redirect('/admin/focus');
})

module.exports = router