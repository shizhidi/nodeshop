/*
 * @Author: shizhidi
 * @Date: 2018-02-01 23:01:15
 * @Last Modified by: shizhidi
 * @Last Modified time: 2018-02-11 17:48:16
 */


var express = require('express');
const router = express.Router();
const Users = require('../models/usersModel');

/* GET users page. */
router.get('/', function(req, res, next) {
  //用户登录
  console.log('用户列表');
  res.json({
    msg: '用户列表'
  });
});

router.post('/getUserName', function (req, res, next) {
  const userId = req.cookies.userId
　if (!userId) {
    res.json({
      status: '1002',
      msg: '用户id参数有误'
    });
  }
  Users.findOne({userId:userId}, function(err,doc){
    if (err) {
      res.json({
        status: '1',
        msg: '用户获取失败',
        error: err
      });
    }else{
      res.json({
        status: '0',
        msg: '用户获取成功',
        result: doc.userName
      });
    }
  })
})

router.post('/login', function(req, res, next) {
  //const username = req.query.username
  //const password = req.query.password
  console.log('用户登录');
  const {userName, userPwd} = req.body;
  Users.findOne({userName:userName,userPwd:userPwd}, function(err,docs){
    if (err){
      res.json({
        status: '1002',
        error: err,
        msg: '查无此用户'
      })
    }else{

      let count = 0
      docs.cartList.forEach((cart) => {
        count += +cart.productNum
      })

      res.cookie('userId', docs.userId,{
        maxAge: 5000000
      });

      res.json({
        status: '0',
        msg: '',
        userName: docs.userName,
        cartCount: count
      })

    }
  })
})

router.post('/logout',function (req, res, next) {
  const userId = req.cookies.userId
  if (userId) {
    res.cookie('userId', userId,{
      maxAge: -1
    });

    res.json({
      status: true
    })
  }
})

router.get('/checkLogin',function (req, res, next) {
  const userId = req.cookies.userId
  if (userId) {
    Users.findOne({userId:userId},function (err, user) {
      if (err) {
        res.json({
          status: '1001',
          msg: '数据库查无此用户'
        })
      }else{
        let count = 0
        user.cartList.forEach((cart) => {
          count += +cart.productNum
        })
        res.json({
          status: '0',
          msg: '已登录',
          userName: user.userName,
          cartCount: count
        })
      }
    })
  }else{
    res.json({
      status: '1',
      msg: '用户未登录,或cookie过期'
    })
  }
})

// 购物车接口
router.post('/cartList',function (req, res, next) {
  const userId = req.cookies.userId
  if (userId) {
    Users.findOne({userId:userId})
      .then(doc => {
        res.json({
          status: '0',
          count:doc.cartList.length,
          cartList: doc.cartList
        })
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

router.post('/updateChecked',function (req, res, next) {
  const userId = req.cookies.userId
  const productId = req.body.productId
  const checked = req.body.checked
  if (userId) {
    Users.findOne({userId:userId})
      .then(user => {
        user.cartList.forEach((cart) => {
          if (cart.productId == productId) cart.checked = checked
        })

        user.save(function (err, doc) {
          if (err) {
            res.json({
              status: false,
              msg: '保存选中状态失败'
            })
          }else{
            res.json({
              status: true,
              result: doc
            })
          }
        })

      })
      .catch(err => {
        res.json({
          status: false,
          error: err
        })
      })
  }
})

router.post('/delCart',function (req, res, next) {
  const userId = req.cookies.userId
  const productId = req.body.productId
  if (userId) {
    Users.update({userId:userId},{'$pull':{'cartList':{'productId':productId}}},function(err,doc){
      if (err) {
        res.json({
          status: '1003',
          msg: '删除购物车数据操作失败',
          error: err
        })
      }else{
        res.json({
          status: '0',
          result: doc
        })
      }
    })
  }
})

router.get('/getCartCount',function (req, res, next) {
  Users.findOne({userId:req.cookies.userId},function (res, user) {
    if (err) {
      res.json({
        status: '1002',
        msg: '没有查找到此用户',
      })
    }else{
      //循环遍历用户购物车数量
      let count = 0
      user.cartList.forEach((cart) => {
        count += +cart.productNum
      })
      res.json({
        status: '0',
        result: count
      })
    }
  })
})

//地址接口
router.post('/addressList',function (req, res, next) {
  const userId = req.cookies.userId
  if (userId) {
    Users.findOne({userId:userId})
      .then(doc => {
        res.json({
          status: true,
          count:doc.addressList.length,
          addressList: doc.addressList
        })
      })
      .catch((err) => {
        res.json({
          status: false,
          msg: '获取地址列表失败',
          error: err,
        });
      })
  }
})

router.post('/setAddress',function (req, res, next) {
  const userId = req.cookies.userId
  const addressId = req.body.addressId
  if (userId) {
    Users.findOne({userId:userId})
      .then(user => {

        user.addressList.forEach((address) => {
          if (address.addressId == addressId) {
            address.isDefault = true
          }else{
            address.isDefault = false
          }
        })

        user.save(function (err,doc) {
          if (err) {
            res.json({
              status: false,
              error: err
            })
          }else{
            res.json({
              status: true,
              result: doc
            })
          }
        })

      })
      .catch((err) => {
        res.json({
          status: false,
          msg: '设置默认地址失败',
          error: err,
        });
      })
  }
})

router.post('/delAddress',function (req, res, next) {
  const userId = req.cookies.userId
  const addressId = req.body.addressId
  if (userId) {
    Users.update({userId:userId},{'$pull':{'addressList':{'addressId': addressId}}},function (err,doc) {
      if (err) {
        res.json({
          status: false,
          error: err,
          msg: '删除地址失败'
        })
      }else{
        res.json({
          status: true,
          result: doc
        })
      }
    })
  }
})

//创建订单接口
router.post('/addOrder',function (req ,res, next) {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  let orderTotal = req.body.orderTotal

  Users.findOne({userId:userId})
    .then((user) => {
      let selectAddress,selectGoods = []
      if (user) {
        user.addressList.forEach((address) => {
          if (address.addressId == addressId) selectAddress = address
        })

        user.cartList.forEach((cart) => {
          if (cart.checked) selectGoods.push(cart)
        })

        let temS = new Number().generateMixed(6).toString()
        let orderId = new Date().getTime() + temS
        let order = {
          orderId,
          orderTotal: orderTotal,
          addressInfo: selectAddress,
          goodsList: selectGoods,
          orderStatus: 0,
          createDate: new Date().Format('yyyy-MM-dd hh:mm:ss')
        }

        user.orderList.push(order)

        user.save(function(err,doc){
          if (err) {
            res.json({
              status: false,
              error: err,
              msg: '创建订单失败'
            })
          }else{
            res.json({
              status: true,
              orderId: orderId
            })
          }
        })
      }
    })
    .catch((err) => {
      res.json({
        status: false,
        error: err
      })
    })

})

//获取订单总价
router.post('/getOrderTotal',function (req, res, next) {
  const orderId = req.body.orderId
  Users.findOne({userId:req.cookies.userId})
  .then(doc => {
    let total
    doc.orderList.forEach((order) => {
      if (order.orderId == orderId) total = order.orderTotal
    })
    res.json({
      status: '0',
      orderTotal: total
    })
  })
  .catch((err) => {
    res.json({
      status: '1',
      msg: '获取订单金额总数失败',
      error: err,
    });
  })
})

module.exports = router;
