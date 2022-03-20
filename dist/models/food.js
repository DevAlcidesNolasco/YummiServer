"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const ratingScheme = new _mongoose.Schema({
  user: {
    ref: 'User',
    type: _mongoose.Schema.Types.ObjectId
  },
  rate: Number
});
const foodSchema = new _mongoose.Schema({
  name: String,
  description: String,
  photoURL: String,
  price: Number,
  rating: [ratingScheme]
});

var _default = (0, _mongoose.model)('Food', foodSchema);

exports.default = _default;