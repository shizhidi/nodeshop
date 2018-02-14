/*
 * @Author: shizhidi
 * @Date: 2018-02-01 21:45:00
 * @Last Modified by: shizhidi
 * @Last Modified time: 2018-02-14 21:41:38
 */

var mongoose = require('mongoose');
var config = require('./config');

var env = process.env.NODE_ENV || 'development'

module.exports = function() {
    //连接数据库
    var mongo = env == 'development' ? config.mongodb : config.nodecall
    var mongodb = mongoose.connect(mongo,{useMongoClient:true});

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
