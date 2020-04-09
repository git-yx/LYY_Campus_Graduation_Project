const router = require('koa-router')()
router.prefix('/goods');

let tools = require('../../common/tools.js');
let goodsCate = require('../../model/goodsCateModel.js');
let goods = require('../../model/goodsModel.js');
let goodsImage = require('../../model/goodsImageModel.js');

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


router.get('/', async function (ctx) {
    // 连接Mongo 实现数据查询显示  调用方法  find(集合名,查询条件)
    // 1. 动态当前页
    const { page = 1, keyword } = ctx.request.query;
    // 注意
    let json = {};
    //{title:{$regex:/mac/}}   
    if (keyword) { json = Object.assign({ title: { $regex: new RegExp(keyword) } }) }
    // 2. 每页显示条数
    let pageSize = 3;
    // 3. 总条数
    let totals = await goods.find(json).count();
    // 4. 总页数
    let totalPages = Math.ceil(totals / pageSize);
    // 5.每页开始的编号
    let offset = (page - 1) * pageSize;
    // 分页   skip(offset).limit(pageSize)
    //let results = await goods.find(json).skip(offset).limit(pageSize).sort({"sort":-1});
    let results = await ctx.model.goods.aggregate([
        {
            $lookup: {  // 两表联合 jion
                from: 'goods_cate',
                localField: 'cate_id',
                foreignField: '_id',
                as: 'catelist',
            },
        },
        // where查询条件 模糊查询
        { $match: json },
        { $sort: { "sort": -1 } },
        { $skip: offset },
        { $limit: pageSize }
    ]);
    await ctx.render('admin/goods/index.html', {
        data: results,
        sd: tools.formatTime(),
        totalPages,
        page,
        keyword
    });
})

// 跳转添加页面
router.get('/add', async function (ctx) {
    // 查询 goodsCate 表中所有的分类信息
    let results = await goodsCate.find({});
    await ctx.render('admin/goods/add.html', { goodsCate: results });
})

// 执行增加
router.post('/doadd', upload.fields([
    {
        name: 'goods_img',
        maxCount: 5
    }
]), async (ctx)=> {
    if (ctx.req.files['goods_img'] == undefined || ctx.req.files['goods_img'] == null) { 
        await ctx.render('admin/error.html', { message: '图像必须上传', redirectUrl: '/admin/goods/add' });
    } else {
        // 图像路径拼接  upload/2224ev.jpg,upload/dfdfdf.jpg,
        let goods_image_list = ctx.req.files['goods_img'];
        let goods_img_string = '';
        for (k in goods_image_list) {
            goods_img_string += goods_image_list[k].path.substr(7).replace(/\\/g, '/') + ',';
        }
        // 商品参数
        let title = ctx.req.body.title;
        let sub_title = ctx.req.body.sub_title;
        let cate_id = ctx.req.body.cate_id;
        let goods_number = ctx.req.body.goods_number;
        let shop_price = ctx.req.body.shop_price;
        let market_price = ctx.req.body.market_price;
        let goods_size = JSON.stringify(ctx.req.body.goods_size);
        let goods_color = JSON.stringify(ctx.req.body.goods_color);
        let goods_keywords = ctx.req.body.goods_keywords;
        let goods_content = ctx.req.body.goods_content.replace(/http:\/\/localhost:3000/g,"https://lyy.aesen.cc:8443/api")
        let sort = ctx.req.body.sort;
        let is_new = ctx.req.body.is_new || 0;
        let is_hot = ctx.req.body.is_hot || 0;
        let is_best = ctx.req.body.is_best || 0;
        let goods_img = goods_img_string;
        let goodss = new goods({
            title,
            sub_title,
            cate_id,
            goods_number,
            shop_price,
            market_price,
            goods_img,
            goods_size,
            goods_color,
            goods_keywords,
            goods_content,
            sort,
            is_new,
            is_hot,
            is_best
        })
        //console.log(ctx.req.files);
        let addResult = await goodss.save();
        //  goodsImage 表中 img_url 的单个图像一个一个存到数据库中
        for (let i = 0; i < goods_image_list.length; i++) {
            const goodsImgRes = new goodsImage({
                goods_id: addResult._id,
                img_url: goods_image_list[i].path.substr(7).replace(/\\/g, '/')// /upload/20191111/22324353.jpg
            });
            await goodsImgRes.save();
        }
        ctx.redirect('/admin/goods');
    }
})

// 更新页面
router.get('/edit', async function (ctx) {
    let _id = ctx.request.query._id;
    let catResults = await goodsCate.find({});
    let result = await goods.find({ _id });
    console.log('###', ctx.state.prevPage);
    // 去 goodsImage 表中查找当前产品的所有图像
    let goodsImageresult = await goodsImage.find({ goods_id: _id });
    await ctx.render('admin/goods/edit.html',
        {
            dataone: result[0],
            goodsCate: catResults,
            goodsImage: goodsImageresult,
            prevPage: ctx.state.prevPage   // /admin/goods?page=2
        });
})

// 执行更新
router.post('/doedit', upload.fields([
    {
        name: 'goods_img',
        maxCount: 5
    }
]), async function (ctx) {
    let prevPage = ctx.req.body.prevPage;
    let _id = ctx.req.body._id;
    // 无图片
    if (ctx.req.files['goods_img'] == undefined || ctx.req.files['goods_img'] == null) {
        let title = ctx.req.body.title;
        let sub_title = ctx.req.body.sub_title;
        let cate_id = ctx.req.body.cate_id;
        let goods_number = ctx.req.body.goods_number;
        let shop_price = ctx.req.body.shop_price;
        let market_price = ctx.req.body.market_price;
        let goods_size = JSON.stringify(ctx.req.body.goods_size);
        let goods_color = JSON.stringify(ctx.req.body.goods_color);
        let goods_keywords = ctx.req.body.goods_keywords;
        let goods_content = ctx.req.body.goods_content.replace(/http:\/\/localhost:3000/g,"https://lyy.aesen.cc:8443/api")
        let sort = ctx.req.body.sort;
        let is_new = ctx.req.body.is_new || 0;
        let is_hot = ctx.req.body.is_hot || 0;
        let is_best = ctx.req.body.is_best || 0;
        let updateResult = await goods.updateOne({ "_id": _id }, {
            title,
            sub_title,
            cate_id,
            goods_number,
            shop_price,
            market_price,
            goods_size,
            goods_color,
            goods_keywords,
            goods_content,
            sort,
            is_new,
            is_hot,
            is_best
        });
    } 
    // 有图片
    else {
        // 图像路径拼接  upload/2224ev.jpg,upload/dfdfdf.jpg,
        let goods_image_list = ctx.req.files['goods_img'];
        let goods_img_string = '';
        for (k in goods_image_list) {
            goods_img_string += goods_image_list[k].path.substr(7) + ',';
        }
        let title = ctx.req.body.title;
        let sub_title = ctx.req.body.sub_title;
        let cate_id = ctx.req.body.cate_id;
        let goods_number = ctx.req.body.goods_number;
        let shop_price = ctx.req.body.shop_price;
        let market_price = ctx.req.body.market_price;
        let goods_size = JSON.stringify(ctx.req.body.goods_size);
        let goods_color = JSON.stringify(ctx.req.body.goods_color);
        let goods_keywords = ctx.req.body.goods_keywords;
        let goods_content = ctx.req.body.goods_content;
        let sort = ctx.req.body.sort;
        let is_new = ctx.req.body.is_new || 0;
        let is_hot = ctx.req.body.is_hot || 0;
        let is_best = ctx.req.body.is_best || 0;
        let goods_img = goods_img_string;
        let updateResult = await goods.updateOne({ "_id": _id }, {
            title,
            sub_title,
            cate_id,
            goods_number,
            shop_price,
            market_price,
            goods_img,
            goods_size,
            goods_color,
            goods_keywords,
            goods_content,
            sort,
            is_new,
            is_hot,
            is_best
        });
        // 修改添加图像
        for (let i = 0; i < goods_image_list.length; i++) {
            const goodsImgRes = new goodsImage({
                goods_id: _id,
                img_url: goods_image_list[i].path.substr(7),
            });
            await goodsImgRes.save();
        }
    }
    ctx.redirect(prevPage);
})


// 删除图像goodsImageRemove
router.post('/goodsImageRemove', async function (ctx) {
    const goods_image_id = ctx.request.body.goods_image_id;
    // 注意  图片要不要删掉   fs模块删除以前当前数据对应的图片
    const result = await goodsImage.deleteOne({ _id: goods_image_id }); // 注意写法
    if (result) {
        ctx.body = { success: true, message: '删除数据成功' };  // json
    } else {
        ctx.body = { success: false, message: '删除数据失败' }; //json
    }
})

module.exports = router