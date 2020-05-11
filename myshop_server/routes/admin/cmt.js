const router = require('koa-router')()
router.prefix('/cmt');

let cmt = require('../../model/cmtModel.js');

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

// 执行增加
router.post('/doadd', upload.fields([ { name: 'goods_img', maxCount: 5 } ]),async (ctx)=> {
    console.log('文件')
    if (ctx.req.files['goods_img'] == undefined || ctx.req.files['goods_img'] == null) { 
        await ctx.render('admin/error.html', { message: '图像必须上传', redirectUrl: '/admin/goods/add' });
    } else {
        // 图像路径拼接  upload/2224ev.jpg,upload/dfdfdf.jpg,
        let goods_image_list = ctx.req.files['goods_img'];
        let goods_img_string = '';
        for (k in goods_image_list) {
            goods_img_string += goods_image_list[k].path.substr(7).replace(/\\/g, '/') + ',';
        }
        console.log('图像路径拼接',goods_img_string)
    }
})


module.exports = router

// // 添加评测
// router.get('/cmt/doadd', async function (ctx) {
//     let userId = mongoose.Types.ObjectId(ctx.request.query.userId);
//     console.log('查询所有收藏',userId);
//     let results = await userLike.aggregate([
//         {
//             $lookup: {  // 两表联合 jion
//                 from: 'goods',
//                 localField: 'itemId',
//                 foreignField: '_id',
//                 as: 'likeList',
//             },
//         }
//     ]);
//     console.log('查询所有收藏结果',results);
//     if (results.length > 0) {
//         ctx.body = {
//             "success": true,
//             "message": "OK",
//             "data": results
//         };
//     } else {
//         ctx.body = {
//             "success": false,
//             "message": "没有查询到订单内容",
//             "data": []
//         };
//     }
// })