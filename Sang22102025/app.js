var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
let { Response } = require('./utils/responseHandler');

// ✅ Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/NNPTUD-S5')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// ✅ Cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ✅ Middleware cơ bản
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Gắn các router có sẵn
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', require('./routes/roles'));
app.use('/auth', require('./routes/auth'));
app.use('/files', require('./routes/files'));

// ✅ Cho phép truy cập ảnh upload công khai
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ ROUTE HIỂN THỊ TRANG UPLOAD ẢNH (thêm mới)
app.get('/upload', (req, res) => {
  // gửi file HTML trong thư mục templates
  res.sendFile(path.join(__dirname, 'templates', 'upload.html'));
});

// ✅ Bắt lỗi 404
app.use(function (req, res, next) {
  next(createError(404));
});

// ✅ Bộ xử lý lỗi chung
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  Response(res, err.status || 500, false, err);
});

// ✅ Xuất app để bin/www sử dụng
module.exports = app;
