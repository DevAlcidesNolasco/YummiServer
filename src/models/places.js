import { Schema, model } from 'mongoose'
const socialMediaSchema = new Schema({
  media: {
    type: String,
    enum: ['Instagram', 'Facebook', 'Twitter'],
    required: [true, 'Plataforma no permitida']
  },
  user: {
    type: String,
    require: [true, 'Formato usuario no valido']
  }
})
const contactSchema = new Schema({
  socialMedia: [socialMediaSchema],
  telephone: [Number]
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
const placeSchema = new Schema({
  categories: {
    type: [String],
    required: [true, 'Categoria invalida']
  },
  contact: contactSchema,
  description: {
    type: String,
    required: [true, 'Descripcion invalida']
  },
  gallery: [String],
  ubication: String,
  location: locationSchema,
  name: {
    type: String,
    required: [true, 'Nombre invalido']
  },
  rating: [ratingScheme],
  schedule: [workDays]
  // menu: [foodSchema]
})

placeSchema.index({ location: '2dsphere' })
// placeModel.createIndexes({ location: '2dsphere' })
export default model('Place', placeSchema)
