import jwt from 'jsonwebtoken'
import User from '../models/users'

const TOKEN_SECRET = process.env.TOKEN_SECRET

const noNeededInfo = {
  password: 0,
  photoUrl: 0,
  email: 0,
  fullName: 0,
  createdAt: 0,
  updatedAt: 0
}

const jwtErrors = {
  TokenExpiredError: 'Token Expired',
  JsonWebTokenError: 'Token Invalido'
}

export const tokenVerification = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) return res.status(403).json({ message: 'No token provided' })
  try {
    const decoded = jwt.verify(authorization, TOKEN_SECRET)
    req.body.sessionUId = decoded?.id
    //  console.log(`userId is ${req.userId}`)
    const userFound = await User.findOne({ _id: decoded?.id }, { password: 0 })
    if (!userFound) return res.status(404).json({ message: 'User doesnt exist' })
    return next()
  } catch (error) {
    return res.status(401).json({ message: jwtErrors[error.name] ?? error.name })
  }
}

export const roleValidation = async (req, res, next) => {
  const { rolesRequire } = req.body
  const { sessionUId } = req.body
  const rolesArray = rolesRequire ?? ['Admin']
  const { roles } = await User.findOne({ _id: sessionUId }, { noNeededInfo }).populate('roles')
  const rolesUser = roles.map((data) => data.name)
  if (!rolesArray.some((roleRequire) => rolesUser.includes(roleRequire))) return res.status(403).json({ error: 'Rol asignado no autorizado' })
  return next()
}
