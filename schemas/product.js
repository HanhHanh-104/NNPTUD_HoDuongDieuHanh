let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  price: { type: Number, default: 1, min: 0 },
  description: { type: String, default: "good product", trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
  isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

module.exports = mongoose.model('product', productSchema);
