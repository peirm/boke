var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//路由文件引入进来
var routes = require('./routes/index');
//数据库配置文件信息撒地方
var settings = require('./settings');
//flash模块
var flash = require('connect-flash');
//支持会话地方
var session = require('express-session');
//将会话保存在mongodb当中去.
var MongoStore  = require('connect-mongo')(session);
var app = express();
app.use(flash());
app.use(session({
    //防止篡改cookie
    secret:settings.cookieSecret,
    //设置值
    key:settings.db,
    //cookie的生存周期
    cookie:{maxAge:1000*60*60*24*30},
    //将session的信息存储到数据库当中去.
    store: new MongoStore({
        //连接数据库当中的blog数据库
        url: 'mongodb://localhost/blog'
    }),
    resave:false,
    saveUninitialized:true
    //我是注释
}));

// 设置views文件夹为存放视图文件的目录
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件
app.use(logger('dev'));
//加载解析json的中间件
app.use(bodyParser.json());
//加载解析urlencoded的中间件
app.use(bodyParser.urlencoded({ extended: false }));
//加载解析cookie的中间件
app.use(cookieParser());
//设置public为静态资源目录,也就是如果网站的地址是signin.html，那么在这里就是public/signin.html了。
app.use(express.static(path.join(__dirname, 'public')));

//将app引入进路由，在index.js当中设置路由就可以了
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
