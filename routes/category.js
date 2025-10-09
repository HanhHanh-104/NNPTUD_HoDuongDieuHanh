var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category');
let { Response } = require('../utils/responseHandler');
let { Authentication, Authorization } = require('../utils/authHandler');

// VIEW: USER, MOD, ADMIN
router.get('/', Authentication, Authorization("USER","MOD","ADMIN"), async function(req, res) {
  try {
    let categories = await categorySchema.find({ isDeleted: false });
    Response(res, 200, true, categories);
  } catch (err) {
    Response(res, 500, false, err.message);
  }
});

router.get('/:id', Authentication, Authorization("USER","MOD","ADMIN"), async function(req, res) {
  try {
    let item = await categorySchema.findById(req.params.id);
    if(!item || item.isDeleted){
      return Response(res, 404, false, "Category not found");
    }
    Response(res, 200, true, item);
  } catch (err) {
    Response(res, 400, false, "Invalid category id");
  }
});

// CREATE: MOD, ADMIN
router.post('/', Authentication, Authorization("MOD","ADMIN"), async function(req, res) {
  try {
    let { name } = req.body;
    let created = await categorySchema.create({ name });
    Response(res, 201, true, created);
  } catch (err) {
    Response(res, 400, false, err.message);
  }
});

// UPDATE: MOD, ADMIN
router.put('/:id', Authentication, Authorization("MOD","ADMIN"), async function(req, res) {
  try {
    let { name } = req.body;
    let updated = await categorySchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { name } },
      { new: true, runValidators: true }
    );
    if(!updated) return Response(res, 404, false, "Category not found");
    Response(res, 200, true, updated);
  } catch (err) {
    Response(res, 400, false, err.message);
  }
});

// DELETE: ADMIN (soft delete)
router.delete('/:id', Authentication, Authorization("ADMIN"), async function(req, res) {
  try {
    let deleted = await categorySchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if(!deleted) return Response(res, 404, false, "Category not found");
    Response(res, 200, true, deleted);
  } catch (err) {
    Response(res, 400, false, err.message);
  }
});

module.exports = router;
