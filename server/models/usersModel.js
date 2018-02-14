/*
 * @Author: shizhidi
 * @Date: 2018-02-01 22:09:19
 * @Last Modified by: shizhidi
 * @Last Modified time: 2018-02-09 14:21:05
 */

var mongoose = require('mongoose');

//定义用户集合的模型
var UserSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": [{
    "orderId": String,
    "orderTotal": Number,
    "addressInfo": {
      "addressId": String,
      "userName": String,
      "streetName": String,
      "postCode": Number,
      "tel": Number,
      "isDefault": Boolean
    },
    "goodsList": [{
      "productImage": String,
      "salePrice": String,
      "productName": String,
      "productId": String,
      "productNum": Number,
      "checked": Number
    }],
    "orderStatus": String,
    "createDate": String
  }],
  "cartList": [{
    "productImage": String,
    "salePrice": String,
    "productName": String,
    "productId": String,
    "productNum": Number,
    "checked": Number
  }],
  "addressList": [{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode": String,
    "tel": String,
    "isDefault": Boolean
  }]
});

//给用户模型添加方法
UserSchema.methods.getOneUser = function (userId) {
  return this.find({ userId: new RegExp(userId, 'i') });
}

module.exports = mongoose.model('Users', UserSchema);
