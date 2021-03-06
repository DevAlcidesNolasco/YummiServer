import User from '../models/users'
import Role from '../models/roles'

export const getAllUsers = async (req, res) => {
  const users = await User.find({}, { password: 0, createdAt: 0, updatedAt: 0 }).populate('roles')
  if (!users) return res.json({ error: 'No se pudo recopilar información' })
  return res.status(200).json({ users })
}

export const getUserById = async (req, res) => {
  const { userId } = req.params
  const user = await User.findOne({ _id: userId }, { password: 0 })
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
  return res.status(200).json({ user })
}

export const updateUserById = async (req, res) => {
  const { userId } = req.params
  const { user } = req.body
  if (user._id) delete user._id
  if (user.password) delete user.password
  const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $set: { ...user } }, { new: true, projection: { password: 0 } })
  if (!updatedUser) return res.status(400).json({ error: 'No se pudo realizar la acción' })
  return res.status(200).json({
    user: updatedUser,
    message: 'Se realizó accion exitosamente'
  })
}

export const deleteUserById = async (req, res) => {
  const { userId } = req.params
  const userDeleted = await User.findOneAndDelete({ _id: userId }, { new: true, projection: { password: 0 } })
  if (!userDeleted) return res.json({ error: 'No se pudo realizar accion' })
  return res.status(200).json(userDeleted)
}

export const getUserRoles = async (req, res) => {
  const rolesArray = await Role.find({})
  if (!rolesArray) return res.json({ error: 'No se pudieron recuperar roles' })
  return res.status(200).json({ result: rolesArray })
}
