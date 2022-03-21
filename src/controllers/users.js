import User from '../models/users'
import { isValidObjectId } from '../libs/validations'

// OJO -------------------------------------------------------
// ********sanitizar el userID en el archivo /routes/users.js

export const getUserInfo = async (req, res) => {
  const { userId } = req.params
  if (!userId) return res.json({ message: 'No se ha proporcionado id de usuario' })
  if (!isValidObjectId(userId)) return res.json({ message: 'Id no valido' })
  const userFound = await User.findOne({ _id: userId }, { password: 0 })
  res.json(userFound)
}
export const getAllUsers = async (req, res) => {
  return res.json(await User.find({}, { password: 0, createdAt: 0, updatedAt: 0 }).populate('roles'))
}
export const updateUser = async (req, res) => {
  const { userId } = req.params
  const { body } = req
  if (!userId) return res.json({ message: 'No se ha proporcionado id de usuario' })
  if (!isValidObjectId(userId)) return res.json({ message: 'Id no valido' })
  //  if (req.userId === userId) return res.json({ message: 'No se puede actualizar usted mismo' })
  console.log('updateUser', body)
  const userUpdated = await User.findOneAndUpdate({ _id: userId }, body, { new: true })
  res.json({
    userUpdated
  })
}
export const deleteUser = async (req, res) => {
  const { userId } = req.params
  if (!userId) return res.json({ message: 'No se ha proporcionado id de usuario' })
  if (!isValidObjectId(userId)) return res.json({ message: 'Id no valido' })
  if (req.userId === userId) return res.json({ message: 'No se puede eliminar usted mismo' })
  const userDeleted = await User.findOneAndDelete({ _id: userId })
  if (!userDeleted) return res.json({ message: 'Usuario no existe' })
  res.json(userDeleted)
}
export const prepareToUpdateImage = (req, res, next) => {
  const { file } = req
  const { filename } = file
  const photoUrl = `${req.protocol}://${req.get('host')}/gallery/profile/${filename}`
  req.body = { photoUrl }
  next()
}
