const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Thư mục lưu file
const uploadDir = path.join(__dirname, '../uploads/avatars');

// ✅ Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Tạo thư mục uploads/avatars thành công');
}

// ✅ Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Chỉ được phép upload file ảnh!'), false);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
