var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var mongoose = require('./config/mongoose');
var mongodb = mongoose();

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');
require('./util/util');

var app = express();

//指定模板位置
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
//指定模板引擎
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './dist')));

// app.get('*', function(req, res) {
//   const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
//   res.send(html)
// })

app.use(function (req,res,next) {
  if(req.cookies.userId){
    next();
  }else{
      console.log("url:"+req.originalUrl);
      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.originalUrl.indexOf('/goodsList')>-1){
          next();
      }else{
          res.json({
            status:'10001',
            msg:'当前未登录',
            result:''
          });
      }
  }
});


app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
