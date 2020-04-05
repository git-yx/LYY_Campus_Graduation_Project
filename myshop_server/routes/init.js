const router = require('koa-router')();

const init = require('../model/init/init')

router.prefix('/init')

router.get('/addAddress', async (ctx, next) => { init.addAddress.save((err, doc) => console.log) })
router.get('/addFocus', async (ctx, next) => { init.addFocus.save((err, doc) => console.log) })
router.get('/addGoodsCate', async (ctx, next) => { init.addGoodsCate.save((err, doc) => console.log) })
router.get('/addGoodsImage', async (ctx, next) => { init.addGoodsImage.save((err, doc) => console.log) })
router.get('/addGood', async (ctx, next) => { init.addGood.save((err, doc) => console.log) })
router.get('/addManager', async (ctx, next) => { init.addManager.save((err, doc) => console.log) })
router.get('/addOrderItem', async (ctx, next) => { init.addOrderItem.save((err, doc) => console.log) })
router.get('/addOrder', async (ctx, next) => { init.addOrder.save((err, doc) => console.log) })
router.get('/addUserLike', async (ctx, next) => { init.addUserLike.save((err, doc) => console.log) })
router.get('/addUser', async (ctx, next) => { init.addUser.save((err, doc) => console.log) })


module.exports = router;