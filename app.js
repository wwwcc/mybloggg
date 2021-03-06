var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-mate'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 注意： flash的使用依赖于session和cookie
app.use(flash());
app.use(session({
  //防止篡改cookie，加密串
  secret: "dsh",
  //cookie的生存周期
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  //将session的信息存储到数据库当中去.
  // store: new MongoStore({
  //     //连接数据库当中的blog数据库
  //     url: 'mongodb://localhost/blog'
  // }),
  resave: false,
  saveUninitialized: true
}));


// 方式一
// index(app);

// 方式二
app.use('/', index);
app.use('/users', users);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
