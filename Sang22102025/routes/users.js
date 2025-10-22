const express = require('express');
const router = express.Router();
const users = require('../schemas/users');
const roles = require('../schemas/roles');
const upload = require('../middlewares/upload');
const verifyToken = require('../middlewares/verifyToken');

// 🧩 Lấy toàn bộ user
router.get('/', async function (req, res, next) {
  try {
    const allUsers = await users.find({ isDeleted: false }).populate({
      path: 'role',
      select: 'name'
    });
    res.send({
      success: true,
      data: allUsers
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Lỗi lấy danh sách người dùng" });
  }
});

// 🧩 Lấy user theo ID
router.get('/:id', async function (req, res, next) {
  try {
    let getUser = await users.findById(req.params.id);
    if (!getUser || getUser.isDeleted) throw new Error("ID không tồn tại");
    res.send({
      success: true,
      data: getUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

// 🧩 Tạo user mới
router.post('/', async function (req, res, next) {
  try {
    const roleName = req.body.role ? req.body.role : "USER";
    const role = await roles.findOne({ name: roleName });
    if (!role) return res.status(400).send({ success: false, message: "Role không tồn tại" });

    const newUser = new users({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: role._id
    });
    await newUser.save();
    res.send({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Lỗi khi tạo user mới" });
  }
});

// 🧩 Cập nhật thông tin user
router.put('/:id', async function (req, res, next) {
  try {
    const user = await users.findById(req.params.id);
    if (!user) return res.status(404).send({ success: false, message: "Không tìm thấy user" });

    user.email = req.body.email || user.email;
    user.fullName = req.body.fullName || user.fullName;
    user.password = req.body.password || user.password;

    await user.save();
    res.send({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Lỗi cập nhật user" });
  }
});

// ✅ Upload 1 ảnh (có xác thực)
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn ảnh' });

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const userId = req.user.id || req.user._id; // Lấy ID từ token

    // 🧩 Cập nhật avatarUrl trong DB
    const user = await users.findByIdAndUpdate(
      userId,
      { avatarUrl: avatarPath },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    res.json({
      success: true,
      message: 'Upload avatar thành công',
      avatarUrl: avatarPath,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi upload avatar' });
  }
});

// ✅ Upload nhiều ảnh (có xác thực)
router.post('/upload-multi', verifyToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'Chưa chọn ảnh nào' });

    const imagePaths = req.files.map(f => `/uploads/avatars/${f.filename}`);

    res.json({
      success: true,
      message: 'Upload nhiều ảnh thành công',
      images: imagePaths
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi upload nhiều ảnh' });
  }
});

module.exports = router;
