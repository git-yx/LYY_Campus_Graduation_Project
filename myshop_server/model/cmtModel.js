const mongoose = require('./db.js');
const d = new Date();

const Schema = mongoose.Schema;  // Schema 映射manager关系型数据库的表结构

const cmtSchema = new Schema({
    phone: { type: Number },
    brandId: { type: Schema.Types.ObjectId },
    title: { type: String },
    cmt: { type: String },
    imgList: { type: Array, default: [] },
    add_time: {
        type: Number,
        default: d.getTime(),
    },
});
module.exports = mongoose.model('cmt', cmtSchema, 'cmt');