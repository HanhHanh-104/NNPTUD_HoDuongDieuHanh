let mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  isDeleted: { type: Boolean, default: false }
},{ timestamps: true });

module.exports = mongoose.model('category', categorySchema);
 