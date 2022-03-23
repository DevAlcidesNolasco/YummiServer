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
