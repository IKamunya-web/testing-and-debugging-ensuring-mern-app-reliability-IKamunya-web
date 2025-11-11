const mongoose = require('mongoose');

const BugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BugSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bug', BugSchema);
