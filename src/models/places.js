import { Schema, model } from 'mongoose'
const socialMediaSchema = new Schema({
  media: {
    type: String,
    enum: ['Instagram', 'Facebook', 'Twitter'],
    required: true
  },
  user: {
    type: String,
    require: true
  }
})
const contactSchema = new Schema({
  socialMedia: [socialMediaSchema],
  telephone: [String]
})
const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
})
const ratingScheme = new Schema({
  user: {
    ref: 'User',
    type: Schema.Types.ObjectId
  },
  rate: Number
})
const workDays = new Schema({
  interval: String | [String],
  from: String,
  to: String
})
// const foodSchema = new Schema({
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
const placeSchema = new Schema({
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
  schedule: [workDays]
  // menu: [foodSchema]
})

placeSchema.index({ location: '2dsphere' })
// placeModel.createIndexes({ location: '2dsphere' })
export default model('Place', placeSchema)
