import User from '../models/users'
import Role from '../models/roles'
import jwt from 'jsonwebtoken'

const TOKEN_SECRET = process.env.TOKEN_SECRET

// LOGIN method
// +  get user credentials(email, password)
// +  sanitize fields
// +  search that user in a db
// +  if user found compare password with hashed
// +  return a token({ id }) and 1 year expiration
// -----------------------------------------------
// REGISTER method
// +  get user credentials(email, fullName, password, password-confirm)
// +  sanitize fields
// +  validate to create a unique user in db
// +  if user is unique save it in db
// +  IN DICUSSION: return token({ id }) with 1 year expiration
// ------------------------------------------------
// RESET PASSWORD method
// +  get user username
// +  sanitize fields
// +  waiting for instructions
// -  NOT DEFINED YET

export const login = async (req, res) => {
  const { email, password } = req.body
  const existingUser = await User.findOne({ email })
  //  const existingUser = await User.findOne({ email }).populate('roles')
  if (!existingUser) return res.status(400).json({ message: 'Ese correo electrónico no está registrado' })
  const matchedPassword = await User.verifyPassword(password, existingUser.password)
  if (!matchedPassword) return res.status(401).json({ message: 'Verifíque el correo o la contraseña' })
  const token = jwt.sign({ id: existingUser._id }, TOKEN_SECRET, { expiresIn: 86400 })
  res.json({ token })
}

export const signUp = async (req, res) => {
  const { email, password, fullName, roles } = req.body
  const existingUser = await User.findOne({ email })
  if (existingUser) return res.json({ message: 'Ese correo ya esta registrado' })
  const newUser = new User({ email, password: await User.encryptPassword(password), fullName })
  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } })
    newUser.roles = foundRoles.map(role => role._id)
  } else {
    const role = await Role.findOne({ name: 'User' })
    newUser.roles = [role._id]
  }
  const savedUser = await newUser.save()
  const token = jwt.sign({ id: savedUser._id }, TOKEN_SECRET, { expiresIn: 86400 })
  res.json({ token })
}

export const changePassword = async (req, res) => {
  const { email, password, newPassword, newPasswordConfirmation } = req.body
  if (!email) return res.json({ message: 'No se proporcionó correo' })
  const existingUser = await User.findOne({ email })
  if (!existingUser) return res.status(400).json({ message: 'Ese correo electrónico no está registrado' })
  const matchedPassword = await User.verifyPassword(password, existingUser.password)
  if (!matchedPassword) return res.status(401).json({ message: 'La contraseña actual es erronea' })
  if (newPassword !== newPasswordConfirmation) return res.status(401).json({ message: 'Nueva contraseña y confirmacion de nueva contraseña no coinciden' })
  existingUser.password = await User.encryptPassword(newPassword)
  const userUpdated = await User.findOneAndUpdate({ _id: existingUser._id }, existingUser, { new: true })
  res.json({ userUpdated })
}
export const forgotPassword = (req, res) => {
  const { email } = req.body
  res.json({ message: `Sending email to ${email}` })
}
