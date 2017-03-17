global.appPath = __dirname;
var express = require('express');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * 日志
 */
var argv = require('yargs').argv;
var host = 'crawler' + (argv.env ? '-' + argv.env : '') + '.enbrands.com';
var moment = require('moment');
var logger = require('morgan');
app.use(logger('dev'));
app.use(function(req,res,next){
  req.headers.host = host;
  next();
});
/**
 * 转换请求报文，在post方法的时候会用到
 */
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 *  开启GZIP 压缩
 */
var compression = require('compression');
app.use(compression());

/**
 * 静态资源
 */ 

app.use('/cache', express.static(path.join(__dirname, '../cache')));
app.use(express.static(path.join(__dirname, '../client')));

/**
 *  批量装载route 接口
 */
var glob = require('glob');

glob.sync(path.resolve(__dirname , 'routes/*.js')).forEach(function(item){
  var name = path.parse(item).name;
  if(name == 'index'){
    name = '';
  }
  app.use('/' + name, require(item));
});

/**
 * 404 错误页
 */
app.all('*', function(req, res, next) {
  var err = new Error();
  err.status = 404 ;
  next(err);
});

/**
 * 异常捕获
 */
app.use(function(err, req, res, next) {

  // 如果是接口报错，则返回错误内容
  // 否则，使用错误页
  if(err.status==200 || err.code!==undefined){
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(err));

    console.error('method', req.method, ':', req.url, /get/i.test(req.method) ? req.query: req.body);
    console.error('--', err);
    console.error('');

  }else{
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    if(err.status==500){
      console.info(res.locals);
    }
    fs.exists(path.resolve(__dirname, '../client/error/' + err.status + '.html'),function(exists){
      if(exists){
        res.sendFile(path.resolve(__dirname, '../client/error/' + err.status + '.html'));
      }else{
        res.render('error');
      }
    });
  }
});

module.exports = app;