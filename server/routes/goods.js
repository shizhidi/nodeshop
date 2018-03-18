/*
 * @Author: shizhidi
 * @Date: 2018-02-01 23:01:21
 * @Last Modified by: shizhidi
 * @Last Modified time: 2018-03-18 21:04:24
 */

const express = require('express');
const router = express.Router();
const Goods = require('../models/goodsModel');
const Users = require('../models/usersModel');
/* GET goods page. */

router.get('/',function (req, res, next) {
  //这个路由默认路径: /goods
  console.log('商品');
})

router.post('/goodsList', function (req, res, next) {
  console.log(req.body.page);
  let page = +req.body.page;
  let pageSize = +req.body.pageSize;
  let skip = (page - 1) * pageSize;
  let goods = Goods.find({salePrice:{ "$gt" : +req.body.filterMin, "$lt" : +req.body.filterMax }}).skip(skip).limit(pageSize);

  goods.sort({'salePrice': req.body.sort}).exec(function(err,docs){
    if (err) {
      res.json({
        status: false,
        msg: err.message
      });
    }else{
      res.json({
        status: true,
        result: {
          count: docs.length,
          list: docs
        }
      });
    }
  })
});

router.post('/addGoods',function (req, res, next) {
 //判断用户是否登陆
  const userId = req.cookies.userId;
  if (userId) {
    const productId = req.body.productId
    const productNum = req.body.productNum
    let Cart;
    //查询用户ID,查找是否有此商品,如有修改商品数量,无就添加商品到此用户下
    Users.findOne({userId:userId})
      .then((user) => {

        let goodsCount = user.cartList.length;
        user.cartList.forEach((cart) => {
          if (cart.productId == productId) Cart = cart
        })

        if (Cart) {
          productNum ? Cart.productNum = productNum : Cart.productNum ++
          user.save(function(err) {
            if (err) {
              res.json({
                status: '1',
                msg: '修改商品数量失败',
                error: err
              })
            }else{
              res.json({
                status: '0',
                goodsCount: goodsCount
              })
            }
          });
        }else{
          Goods.findOne({productId:productId})
            .then((cart) => {
              cart.productNum = 1
              cart.checked = 1
              user.cartList.push(cart)
              user.save(function(err) {
                if (err) {
                  res.json({
                    status: '1',
                    msg: '添加商品失败',
                    error: err
                  })
                }else{
                  goodsCount ++
                  res.json({
                    status: '0',
                    goodsCount: goodsCount
                  });
                }
              });
            });
        }
      })
      .catch((err) => {
        res.json({
          status: '1',
          msg: '添加商品失败',
          error: err,
        });
      })
  }
})

module.exports = router;
