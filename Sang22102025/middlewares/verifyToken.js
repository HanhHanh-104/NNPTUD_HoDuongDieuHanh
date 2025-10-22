const jwt = require('jsonwebtoken');
console.log("verifyToken chạy!");


module.exports = function verifyToken(req, res, next) {
  try {
    // Lấy token từ header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Vui lòng đăng nhập trước khi thực hiện hành động này" });

    // Xác thực token
    const secretKey = "Đây là một chuỗi bí mật siêu dài và không thể đoán được!"; // phải trùng với key trong file auth/login
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
      req.user = decoded; // Lưu thông tin user vào request
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi xác thực" });
  }
};
