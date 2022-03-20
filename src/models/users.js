import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  fullName: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  roles: [
    {
      ref: 'Role',
      type: Schema.Types.ObjectId
    }
  ],
  photoUrl: {
    type: String,
    default: 'http://localhost:3000/users/photo/default.png'
  }
}, {
  timestamps: true,
  versionKey: false
})
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password, salt)
}
userSchema.statics.verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}
export default model('User', userSchema)
