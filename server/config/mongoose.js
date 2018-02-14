/*
 * @Author: shizhidi
 * @Date: 2018-02-01 21:45:00
 * @Last Modified by: shizhidi
 * @Last Modified time: 2018-02-03 10:41:15
 */

var mongoose = require('mongoose');
var config = require('./config');

module.exports = function() {
    //连接数据库
    var mongodb = mongoose.connect(config.mongodb,{useMongoClient:true});

    mongoose.connection.on('connected',function () {
      console.log('Mongodb connected success.');
    })

    mongoose.connection.on('error',function () {
      console.error.bind(console, 'Mongodb connection error:')
    })

    mongoose.connection.on('disconnected',function () {
      console.log('Mongodb connected disconnected.');
    })

    return mongodb;
}
