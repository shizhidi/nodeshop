/*
 * @Author: shizhidi
 * @Date: 2018-02-01 21:58:46
 * @Last Modified by: shizhidi
 * @Last Modified time: 2018-02-08 19:44:12
 */

var mongoose = require('mongoose');

var GoodsSchema = new mongoose.Schema({
  "productId" : String,
  "productName" : String,
  "salePrice" : Number,
  "productImage" : String,
  "productUrl" : String,
  "productNum": Number,
  "checked": Number
});

module.exports = mongoose.model('Goods', GoodsSchema);
