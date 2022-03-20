import { Schema, model } from 'mongoose'
const ratingScheme = new Schema({
  user: {
    ref: 'User',
    type: Schema.Types.ObjectId
  },
  rate: Number
})
const foodSchema = new Schema({
  name: String,
  description: String,
  photoURL: String,
  price: Number,
  rating: [ratingScheme]
})
export default model('Food', foodSchema)
