var express = require('express');
var router = express.Router();
let Category = require('../schemas/category');

// CREATE
router.post('/', async function(req, res) {
  try {
    let doc = new Category({ name: req.body.name });
    await doc.save();
    res.status(201).send({ success: true, data: doc });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// READ: list (chỉ hiển thị chưa xóa)
router.get('/', async function(req, res) {
  try {
    let list = await Category.find({ isDelete: false }).sort({ createdAt: -1 });
    res.send({ success: true, data: list });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// READ: detail
router.get('/:id', async function(req, res) {
  try {
    let item = await Category.findOne({ _id: req.params.id, isDelete: false });
    if (!item) return res.status(404).send({ success: false, message: 'Not found' });
    res.send({ success: true, data: item });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// UPDATE
router.put('/:id', async function(req, res) {
  try {
    let updated = await Category.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { name: req.body.name },
      { new: true }
    );
    if (!updated) return res.status(404).send({ success: false, message: 'Not found' });
    res.send({ success: true, data: updated });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// DELETE (soft delete)
router.delete('/:id', async function(req, res) {
  try {
    let deleted = await Category.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { isDelete: true, deletedAt: new Date() },
      { new: true }
    );
    if (!deleted) return res.status(404).send({ success: false, message: 'Not found or already deleted' });
    res.send({ success: true, message: 'Soft deleted', data: deleted });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

module.exports = router;
