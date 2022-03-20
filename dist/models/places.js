"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const socialMediaSchema = new _mongoose.Schema({
  media: {
    type: String,
    enum: ['Instagram', 'Facebook', 'Twitter'],
    required: true
  },
  user: {
    type: String,
    require: true
  }
});
const contactSchema = new _mongoose.Schema({
  socialMedia: [socialMediaSchema],
  telephone: [String]
});
const locationSchema = new _mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});
const ratingScheme = new _mongoose.Schema({
  user: {
    ref: 'User',
    type: _mongoose.Schema.Types.ObjectId
  },
  rate: Number
});
const workDays = new _mongoose.Schema({
  interval: String | [String],
  from: String,
  to: String
}); // const foodSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     photo: {
//         type: String,
//         required: true
//     },
//     category: {
//         type: [String],
//         required: true
//     }
// })

const placeSchema = new _mongoose.Schema({
  category: {
    type: [String],
    required: [true, 'No se proporcionó categoria']
  },
  contact: contactSchema,
  description: String,
  gallery: [String],
  ubication: String,
  location: locationSchema,
  name: {
    type: String,
    required: [true, 'No se proporcionó nombre']
  },
  rating: [ratingScheme],
  schedule: [workDays] // menu: [foodSchema]

});
placeSchema.index({
  location: '2dsphere'
}); // placeModel.createIndexes({ location: '2dsphere' })

var _default = (0, _mongoose.model)('Place', placeSchema);

exports.default = _default;