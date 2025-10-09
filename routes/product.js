var express = require('express');
var router = express.Router();
let productSchema = require('../schemas/product');
let { Response } = require('../utils/responseHandler');
let { Authentication, Authorization } = require('../utils/authHandler');

// VIEW: USER, MOD, ADMIN
router.get('/', Authentication, Authorization("USER","MOD","ADMIN"), async function(req, res) {
  try {
    let products = await productSchema.find({ isDeleted: false }).populate({ path: 'category', select:'name' });
    Response(res, 200, true, products);
  } catch (err) {
    Response(res, 500, false, err.message);
  }
});

router.get('/:id', Authentication, Authorization("USER","MOD","ADMIN"), async function(req, res) {
  try {
    let item = await productSchema.findById(req.params.id).populate({ path: 'category', select:'name' });
    if(!item || item.isDeleted){
      return Response(res, 404, false, "Product not found");
    }
    Response(res, 200, true, item);
  } catch (err) {
    Response(res, 400, false, "Invalid product id");
  }
});

// CREATE: MOD, ADMIN
router.post('/', Authentication, Authorization("MOD","ADMIN"), async function(req, res) {
  try {
    let { name, price, description, category } = req.body;
    let created = await productSchema.create({ name, price, description, category });
    Response(res, 201, true, created);
  } catch (err) {
    Response(res, 400, false, err.message);
  }
});

// UPDATE: MOD, ADMIN
router.put('/:id', Authentication, Authorization("MOD","ADMIN"), async function(req, res) {
  try {
    let { name, price, description, category } = req.body;
    let updated = await productSchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { name, price, description, category } },
      { new: true, runValidators: true }
    );
    if(!updated) return Response(res, 404, false, "Product not found");
    Response(res, 200, true, updated);
  } catch (err) {
    Response(res, 400, false, err.message);
  }
});

// DELETE: ADMIN (soft delete)
router.delete('/:id', Authentication, Authorization("ADMIN"), async function(req, res) {
  try {
    let deleted = await productSchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
    if(!deleted) return Response(res, 404, false, "Product not found");
    Response(res, 200, true, deleted);
  } catch (err) {
    Response(res, 400, false, err.message);
  }
});

module.exports = router;
