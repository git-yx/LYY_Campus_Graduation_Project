const router = require('koa-router')()
const mongoose = require('../model/db.js')
const goods = require('../model/goodsModel.js');
const goodsCate = require('../model/goodsCateModel.js');
const order = require('../model/orderModel.js');
const orderItem = require('../model/orderItemModel.js');
const User = require('../model/userModel.js');
const address = require('../model/addressModel.js');
const focus = require('../model/focusModel.js');
const userLike = require('../model/userLikeModel.js');
const tools = require('../common/tools.js');

router.get('/', async (ctx, next) => { await ctx.render('index') })

// 轮播图
// /index/carousels
router.get('/index/carousels', async function (ctx) {
    let results = await focus.find({}).sort({ "sort": -1 });
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": results
        };
    } else {
        ctx.body = {
            "success": false,
            "message": "没有查询到轮播图",
            "data": []
        };
    }
})

// 精品,最新,热销商品
router.get('/index/items/:type', async function (ctx) {
    let type = ctx.params.type;  // is_best,is_hot,is_new
    let results = await goods.find({ [type]: 1 }).sort({ "sort": -1 });
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": results
        };
    } else {
        ctx.body = {
            "success": false,
            "message": "没有查询到内容",
            "data": []
        };
    }
})

// 获得所有分类名称信息
router.get('/cats', async function (ctx) {
    let results = await goodsCate.find({}).sort({ "sort": -1 });
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": results
        };
    } else {
        ctx.body = {
            "success": false,
            "message": "没有查询分类内容",
            "data": []
        };
    }
})
// /items/searchByCat?catId='+this.curId
// 通过分类id  查找对应商品
router.get('/items/searchByCat', async function (ctx) {
    let catId = ctx.query.catId;
    let results = await goods.find({ "cate_id": catId }).sort({ "sort": -1 });
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": results
        };
    } else {
        ctx.body = {
            "success": 0,
            "message": "没有查询分类对应的商品",
            "data": []
        };
    }
})

// 调用产品详情页
///items/searchById?itemId
router.get('/items/searchById', async function (ctx) {
    let itemId = ctx.query.itemId;
    let result = await goods.find({ "_id": itemId }).sort({ "sort": -1 });
    if (result.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": result[0]
        };
    } else {
        ctx.body = {
            "success": false,
            "message": "没有查询到具体商品",
            "data": []
        };
    }
})

// 商品id 转换为字符串数组
function strToArray(str) {
    try {
        let tempIds = [];
        if (str) {
            const idsArr = str.replace(/，/g, ',').split(',');
            if (idsArr[idsArr.length - 1] == '') {
                idsArr.pop();
            }
            for (let i = 0; i < idsArr.length; i++) {
                tempIds.push({
                    _id: idsArr[i],
                });
            }
        } else {
            tempIds = [{ 1: -1 }];
        }
        return tempIds;
    } catch (error) {
        return [{ 1: -1 }]; // 返回一个不成立的条件
    }
}

// 通过购物车中的商品查找对应 数据库中的 goods商品信息
//item/queryItems?itemIds='+itemIds
// http://localhost:3000/item/queryItems?itemIds=5dca47d7dca4502bb823e36c,5dca12919078a521a0f3e275
router.get('/item/queryItems', async function (ctx) {
    let itemIds = ctx.request.query.itemIds; //转成二维数组
    let goodsIds = strToArray(itemIds);
    console.log(goodsIds)
    let results = await goods.find({
        $or: goodsIds,    // $or:[{_id:xxx1},{_id:xxxx2}]
    }).sort({ "sort": -1 });
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": results
        };
    } else {
        ctx.body = {
            "success": true,
            "message": "没有查询到具体商品",
            "data": []
        };
    }
})

// 用户登录和注册
router.post('/dologin', async function (ctx) {
    // 1. 如果数据库没有该数据则注册
    // 2. 否则登录
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    const ip = ctx.request.ip.replace(/::ffff:/, '');
    console.log(username, password, ip)
    const userResultL = await User.find({ phone: username, password }, '_id phone');
    if (userResultL.length) {
        ctx.session.userinfos = userResultL;
        ctx.body = {
            success: true,
            msg: '登录成功',
            userinfo: ctx.session.userinfos
        };
    } else {
        // 注册信息
        if (password.length < 6) {
            ctx.body = {
                success: false,
                msg: '密码长度不够',
            };
        } else {
            const userModel = new User({
                phone: username,
                password,
                last_ip: ip,
            });
            // 保存用户
            const userResult = await userModel.save();
            if (userResult) {
                // 获取用户信息
                const userinfos = await User.find({ phone: username }, '_id phone');
                // 用户注册成功以后默认登录
                // cookies 安全      加密
                ctx.session.userinfos = userinfos;
                ctx.body = {
                    success: true,
                    msg: '注册并且登录成功',
                    userinfo: ctx.session.userinfos
                };
            }
        }
    }
})

// 退出登录
router.get('/loginOut', async function (ctx) {
    ctx.session.userinfos = '';
    ctx.body = {
        success: true,
        msg: '退出成功',
    };
})

// 获得用户信息
router.get('/getUser', async function (ctx) {
    let userinfo = ctx.session.userinfos
    console.log(userinfo);
    if (userinfo) {
        ctx.body = { userinfo };
    } else {

        ctx.body = {
            success: false,
            message: "此用户不存在"
        }
    }
});


/*地址接口****************************************************************/
// GET-/address/addressList/{userId}
// 查询用户收货地址列表
router.get('/address/addressList/:userId', async function (ctx) {
    let uid = ctx.params.userId;
    let results = await address.find({ 'uid': uid }).sort({ "sort": -1 });
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "查询用户对应地址列表成功",
            "data": results
        };
    } else {
        ctx.body = {
            "success": false,
            "message": "查询用户对应地址列表失败",
            "data": []
        };
    }
})


// POST-/address/createOrUpdate
// 创建/修改收货地址
router.post('/address/createOrUpdate', async function (ctx) {
    let uid = ctx.request.body.userId;  // string 类型？转 ObjectId类型
    let name = ctx.request.body.receiver;
    let phone = ctx.request.body.mobile;
    let province = ctx.request.body.province;
    let city = ctx.request.body.city;
    let district = ctx.request.body.district;
    let addressInfo = ctx.request.body.descAddress;
    console.log(uid, name, phone, province, city, district, addressInfo);
    let addressId = ctx.request.query.addressId;
    console.log(addressId);
    if (addressId == undefined || addressId == null || addressId == '') {
        // 添加操作
        const addressCount = await address.find({ uid }).count();
        if (addressCount > 20) {
            this.ctx.body = {
                success: false,
                message: '增加收货地址失败 收货地址数量超过限制',
            };
        } else {
            // 添加新地址时，将用户对应的旧地址 default_address 设置为 0(不是默认地址)
            await address.updateMany({ uid }, { default_address: 0 });
            const addressModel = new address({
                uid,
                name,
                phone,
                province,
                city,
                district,
                addressInfo
            });
            // 保存用户
            const addressResult = await addressModel.save();
            if (addressResult) {
                ctx.body = {
                    success: true,
                    message: "添加地址成功"
                }
            }
        }
    } else {
        // 更新操作
        const updateResult = await address.updateOne(
            { "_id": addressId },
            {
                uid,
                name,
                phone,
                province,
                city,
                district,
                addressInfo
            }
        );
        if (updateResult) {
            ctx.body = {
                success: true,
                message: "更新地址成功"
            }
        } else {
            ctx.body = {
                success: false,
                message: "更新地址失败"
            }
        }
    }
})

// POST-/address/fetch
//http://localhost:3000/address/fetch?userId='+userId+'&addressId='+this.addressId
// 查询地址
router.get('/address/fetch', async function (ctx) {
    let userId = ctx.request.query.userId;
    let addressId = ctx.request.query.addressId;
    let results = await address.find({ _id: addressId, uid: userId }).sort({ "sort": -1 });
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": results[0]
        };
    } else {
        ctx.body = {
            "success": true,
            "message": "没有查询地址编号对应地址",
            "data": []
        };
    }
})

// GET-/address/setDefault
// 设置默认的用户收货地址
router.get('/address/setDefault', async function (ctx) {
    let uid = ctx.request.query.userId;  //用户编号
    let addressId = ctx.request.query.addressId; // 用户地址编号
    await address.updateMany({ uid: uid }, { default_address: 0 });
    await address.updateMany({ uid: uid, "_id": addressId }, { default_address: 1 });
    ctx.body = {
        success: true,
        msg: '更新默认收货地址成功'
    };
})

// POST-/address/delete/{addressId}
// 删除用户收货地址
router.get('/address/delete/:addressId', async function (ctx) {
    let addressId = ctx.params.addressId;
    let delResult = await address.deleteOne({ _id: addressId }).sort({ "sort": -1 });
    ctx.body = {
        success: true,
        msg: '删除地址成功'
    };
})


// GET-/address/default/{userId}
// 查询用户默认收货地址
router.get('/address/default/:userId', async function (ctx) {
    let userId = ctx.params.userId;
    let defaultResult = await address.find({ uid: userId, default_address: 1 });
    ctx.body = {
        success: true,
        msg: '查询到默认地址',
        data: defaultResult[0]
    };
})


/**订单处理 =====================================================================*/
function itemToArray(itemStr) {
    let items = itemStr.split(','); // [1001|5,2000|3,3043|2]
    items.pop();
    let itemsObj = [];  // [{_id:1001,num:5},{_id:2000,num:3}]
    for (k in items) {
        itemOne = items[k].split('|');
        itemsObj.push(
            {
                _id: itemOne[0],
                num: itemOne[1]
            }
        )
    }
    return itemsObj;
}

// POST - /order/createOrder
// 生成[待付款]订单
router.post('/order/createOrder', async function (ctx) {
    const uid = ctx.request.query.userId;
    const itemStr = ctx.request.query.itemStr;
    const addressId = ctx.request.query.addressId;
    //itemStr=1001|5,1002|3
    console.log('订单请求体',ctx.request.query);
    let addressResult = await address.find({ "uid": uid, "default_address": 1 });
    let cartList = itemToArray(itemStr);
    console.log("cartList",cartList)
    if (addressResult && addressResult.length > 0 && cartList && cartList.length > 0) {
        let all_price = 0;
        let orderList = [];
        for (k in cartList) {
            let resultOne = await goods.find({ _id: cartList[k]._id });
            if (resultOne) {
                all_price += resultOne[0].market_price * parseInt(cartList[k].num);
                orderList.push({
                    _id: resultOne[0]._id,
                    title: resultOne[0].title,
                    goods_img: resultOne[0].goods_img,
                    market_price: resultOne[0].market_price,
                    num: cartList[k].num,
                })
            }
        }
        console.log("orderList",orderList);
        //执行提交订单的操作
        let order_id = tools.getOrderId();
        let name = addressResult[0].name;
        let phone = addressResult[0].phone;
        let address = addressResult[0].address;
        let pay_status = 0;
        let pay_type = '';
        let order_status = 20;
        let orderModel = new order({ order_id, uid, name, phone, address, pay_status, pay_type, order_status, all_price });
        // 插入订单表
        let orderResult = await orderModel.save();
        // 根据订单表 数据返回，生成订单详情表
        if (orderResult && orderResult._id) {
            //增加商品信息
            for (let i = 0; i < orderList.length; i++) {
                let json = {
                    "uid": uid,
                    "order_id": orderResult._id,   //订单id
                    "product_title": orderList[i].title,
                    "product_id": orderList[i]._id,
                    "product_img": orderList[i].goods_img.split(',')[0],
                    "product_price": orderList[i].market_price,
                    "product_num": orderList[i].num
                }
                let orderItemModel = new orderItem(json);
                await orderItemModel.save();
            }
            ctx.body = {
                success: true,
                msg: '生成订单',
                data: orderResult.order_id
            };
        } else {
            ctx.body = {
                success: false,
                msg: '失败',
                data: []
            };
        }
    } else {
        ctx.body = {
            success: false,
            msg: '失败',
            data: []
        };
    }
})

// 确认订单信息
router.get('/confirm', async function (ctx) {
    let orderId = ctx.request.query.orderId;
    let orderResult = await order.find({ "order_id": orderId });
    if (orderResult && orderResult.length > 0) {
        //获取商品
        let orderItemResult = await orderItem.find({ "order_id": orderResult[0]._id });
        ctx.body = {
            success: true,
            msg: '成功',
            data: {
                orderResult: orderResult[0],
                orderItemResult: orderItemResult,
                id: orderId
            }
        };
    } else {
        //错误
        ctx.body = {
            success: false,
            msg: '失败',
            data: []
        };
    }
});

// 10 待付款(已下单) 20 待收货(已付款)  30 物流（发货） 40已完成（交易成功）  50 取消  60 退货
// POST - /order/queryAllOrders
// 查询所有订单
router.get('/order/queryAllOrders', async function (ctx) {
    let userId = mongoose.Types.ObjectId(ctx.request.query.userId);
    let orderStatus = parseInt(ctx.request.query.orderStatus);
    console.log(userId, orderStatus)
    let json;
    if (orderStatus == 0) {
        json = {
            uid: userId
        }
    } else {
        json = {
            uid: userId,
            order_status: orderStatus
        }
    }
    console.log(json);
    let results = await order.aggregate([
        {
            $lookup: {  // 两表联合 jion
                from: 'order_item',
                localField: '_id',
                foreignField: 'order_id',
                as: 'itemList',
            },
        },
        {
            $match: json   // where查询条件 模糊查询
        },
        {
            $sort: { "sort": -1 }
        }
    ]);
    console.log(results);
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": results
        };
    } else {
        ctx.body = {
            "success": false,
            "message": "没有查询到订单内容",
            "data": []
        };
    }
})

// POST - /order/changeToCanceled
// 订单状态变更: 待付款 -> 已取消
router.get('/order/changeToCanceled', async (ctx, next) => {
    let orderId = ctx.request.query.orderId;
    let updateResult = await order.updateOne(
        { "_id": orderId },
        {
            order_status: 50
        }
    );
    if (updateResult) {
        ctx.body = {
            success: true,
            message: "订单取消了"
        }
    }
})

// POST - /order/changeToFinished
// 订单状态变更: 待收货 -> 已完成
router.get('/order/changeToFinished', async (ctx, next) => {
    let orderId = ctx.request.query.orderId;
    let updateResult = await order.updateOne(
        { "_id": orderId },
        {
            order_status: 40
        }
    );
    if (updateResult) {
        ctx.body = {
            success: true,
            message: "订单完成"
        }
    }
})


// controller 实现
//支付
//router.post('/alipay/dopay', AlipayController.pay);
router.post('/alipay/dopay', async (ctx, next) => {
    // 前端传递数据
    let uid = ctx.request.body.uid;
    let total_price = ctx.request.body.total_price;
    let order_id = ctx.request.body.order_id;
    let return_url = ctx.request.body.return_url;
    let d = new Date();
    console.log(uid, total_price, order_id);
    const data = {
        subject: '一起购鞋帽服装',
        out_trade_no: '53454899',
        total_amount: '0.1'
    }
    const Alipay = require('alipay-mobile');
    const assert = require('assert');
    let alipayOptions = {
        app_id: "2016080800193883",
        appPrivKeyFile: "MIIEpQIBAAKCAQEA6Yhln7ZC8UP2Lk/Cqqms7jw22t2I3GHc0DISd2AR63ipUCv9u+tM0aBpMfftL/FVmUEA1a6w3OHm9oIUmy6B/udMSFr+zcNQCFUl9nKTDdecHBL1gzefVC2Re/xeXwT4MiJ/xi1EzIkuqX05NXRI8hsvv6eaEZrat+GkQdn2o8yS38UxfubTy2yW1pt7Iq94Ux5wYHgJYZ6zy0l7pXsxgffhGBE0D+0On/f8r4AMSfNxdMhg1jxlBoVBZ7HPLQEFFNhrAHDRs2eb80Qyy+M245hda5bzsSfp4Uq8SHDLJQO6QHYDYMeuO3AdQLPe1DGO1O1/vY15XSL8PTgIOtgbOwIDAQABAoIBAQDm44buCApZdUMBeLRTfVxPUlM9wsfcdBkX8lmVkvNEptBnRocf8zzJCNrYn3Hu86EY207S9VtBl0t9rxBmeO3nspEV/HltwEvxYRYeehrwFZrvmsMHz8eEN2Veex5mvYgSMU+5BOq/emYbBoa4VdcFH2HvD+rguwTBxqJaxP/34pg+UG6CQg/wmV/fK/2V8LjVGo6gB469rPHkx58qjYxw+MnNe6Cr91lRb/O/Jbg2HtE3vssvwjt+v3pAdAKyFcGm5qkAm9flNcQBgAw6FJUcQgUE2svAekDiAXTOoV5r6M+BnrWwhqa2qLNCkUwNdgpVZbmwRBn5ZIx33WzAD+ihAoGBAPnYnuRbdXv1JvVeAU5LAKmH0NwNGrbo+f6qZdVU84fq380xR/1oXehdAy+6KtcL6GPVPrUxyEH8+W5GZy0v/lRvo4abd8wta5bmLOEpGzTguZZKE9ZQCU0r987fID5x8V+KI27sXaZU1+hLekxJnVQ5abiH0MucMLQUFk+cJv4xAoGBAO9I6fu5F/Dci3kpYP+VwKm0HhQaovA0+yvUwMFdp/EHWso6Q2k0SHVcH2AB3wjTpAobzViZiBqUFNi+nL2Ajf8ivfIyqIoPkJbf6oExTr7SjMiEp0Rq18A86AkyqCpA1nf0iXH0UOfvw1TdT8xA3sidHlySEynYpFi2oWaTurkrAoGBAN6z4UXp5Dn+1qAmEAHqxwdWYayUHbjmyFfhKW5UD9OaX602fVX7HqHNrtZvGlqfaaD7Zq76VefEB83tAXD887Xt4RROJiWgYuOZ/m0hR/gFTEgTdcU1iGT6iSQkLUicJiwkJNtt4zgtLlsIVFYF1DBMENmEbm/fpGYP9ac2qGcxAoGBAJ7UCiPBF2gULCvvUGg2EZ1TZke36oGA2Vudq5huPyRY2mWzSL2TK6lizZyfgVjNimv/Sk1OE654rmG0HDwZEafRer1B7Oc/L51F4dWBUiCNh08t5g0e0jjS9L3uNvtc8D7NPVI7dlyNpF03TVlpkbcdu2J8v2WeXHBaQUXiNyXjAoGAT+WsH1fnW6PmuwalI0zu8FbfGqj+GQwpWBExvHR1Lk58DN9FWX3xMBU1HiLbzCwl6/SJwrqbS+io07cswabbsYrC0BxJIBgy8g+K2yAV+yOKEEtN2xELo3mwmiGOaXJWmgNXTdakFCndUHGB6dAQU9S8MSZ7Z7BuOyOkH+5qkxc=",
        alipayPubKeyFile: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqT1H/mqZY5/2BT4ilZK5gVzcBbZRtCqQqCwkGxmVH4SOQZDlN7dIzgY2Q33e5Nu2Bgr9BGN+qnGRb2ozRg56aq2jE7XvwygZKi5Pqp88JgKq9rnh+1opCz+y0dekxigVgr954cXaBNADWLQl7ji2kHgJWV0Ji3wvELXhR6YE9uifIDxXpjHBtqtdziyWQazVNgnDqiTgC7Z/q6dlq4CIIz7iPJJmBTNh4NE4ISZGplQ6oB8fq8lHYxa6fJqbPVYT9nnl6ZfRsIyqVMoVP8yXgfzuTYI9gtkfRDYX7C6DkIqdEeVxSp6iv0UaKTLu1gTm4WrTOmE18RG4PZb0j6imJQIDAQAB",
    }
    let service = new Alipay(alipayOptions);
    let basicParams = {
        return_url: 'http://app.yiqigoumall.com/success', //支付成功返回地址
        notify_url: 'http://app.yiqigoumall.com/alipay/alipayNotify'//支付成功异步通知地址，更新订单路由
    }
    return service.createWebOrderURL(data, basicParams)
        .then(result => {
            assert(result.code == 0, result.message)
            assert(result.message == 'success', result.message)
            ctx.body = { result: result.data };
        })
})

//支付成功异步通知
//router.post('/alipay/alipayNotify', AlipayController.alipayNotify);
router.post('/alipay/alipayNotify', async (ctx, next) => {
    const params = ctx.request.body; //支付宝系统给服务器对应的路由的数据，接收 post 提交的数据
    console.log(params);
    //验证异步通知的数据是否正确
    let result = await AlipayService.alipayNotify(params);
    console.log('-------------');
    console.log(result);
    if (result.code == 0) {
        if (params.trade_status == 'TRADE_SUCCESS') {
            console.log('成功')
            // 更新订单
            let out_trade_no_arr = params.out_trade_no.split('_');
            let order_id = out_trade_no_arr[0];
			/*
			   pay_status: { type: Number },   // 支付状态： 0 表示未支付     1 已经支付
			   pay_type: { type: String },      // 支付类型： 1 alipay    2 wechat  
			*/
            await DB.update('order', { "order_id": order_id }, { "pay_status": 1, 'pay_type': 'alipay' });
            //  更改库存... 事物回滚
            //let orderResult = await DB.find('order', { "order_id": order_id });
        }
        console.log('success');
    }
    //接收异步通知
})

// 搜索热门话题
router.get('/index/search', async function (ctx) {
    let keyword = ctx.request.query.keyword;
    // 注意
    let json = {};
    if (keyword) {   //{title:{$regex:/羽绒裤/}}     
        json = Object.assign({ title: { $regex: new RegExp(keyword) } });
    }
    let results = await goods.find(json).sort({ "sort": -1 });
    if (results.length > 0) {
        ctx.body = {
            "success": true,
            "message": "OK",
            "data": results
        };
    } else {
        ctx.body = {
            "success": false,
            "message": "没有查询内容",
            "data": []
        };
    }
})


// 用户收藏商品   /item/like
router.get('/item/like', async function (ctx) {
    let userId = ctx.request.query.userId;
    let itemId = ctx.request.query.itemId;
    const userLikeModel = new userLike({
        userId,
        itemId
    });
    // 保存用户
    const userLikeResult = await userLikeModel.save();
    if (userLikeResult) {
        ctx.body = {
            "success": true,
            "message": "收藏成功"
        };
    }
})

// 用户取消收藏商品  /item/unlike
router.get('/item/unlike', async function (ctx) {
    let userId = ctx.request.query.userId;
    let itemId = ctx.request.query.itemId;
    let delResult = await userLike.deleteOne({ "userId": userId, "itemId": itemId });
    if (delResult) {
        ctx.body = {
            "success": true,
            "message": "取消收藏"
        };
    }
})

// 查询用户是否收藏商品  /item/userIsLikeItem
router.get('/item/userIsLikeItem', async function (ctx) {
    let userId = ctx.request.query.userId;
    let itemId = ctx.request.query.itemId;
    let results = await userLike.find({ "userId": userId, "itemId": itemId });
    if (results.length) {
        ctx.body = {
            "success": true,
            "message": "收藏过",
        };
    } else {
        ctx.body = {
            "success": false,
            "message": "未收藏",
        };
    }
})

module.exports = router;
