import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const likesSchema = new Schema({
  foods: {
    type: [{
      ref: 'Food',
      type: Schema.Types.ObjectId
    }],
    default: [null]
  },
  places: {
    type: [{
      ref: 'Place',
      type: Schema.Types.ObjectId
    }],
    default: [null]
  }
})

const userSchema = new Schema({
  email: {
    type: String,
    require: [true, 'Email no valido'],
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    require: [true, 'Nombre no valido'],
    trim: true
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
  likes: likesSchema
}, {
  timestamps: true,
  versionKey: false
})

userSchema.statics.encryptPassword = async ({ password }) => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password, salt)
}

userSchema.statics.verifyPassword = async ({ password, hash }) => await bcrypt.compare(password, hash)

export default model('User', userSchema)
