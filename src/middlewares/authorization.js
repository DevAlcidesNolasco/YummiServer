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
    req.userId = decoded?.id
    //  console.log(`userId is ${req.userId}`)
    const userFound = await User.findOne({ _id: decoded?.id }, { password: 0 })
    if (!userFound) return res.status(404).json({ message: 'User doesnt exist' })
    next()
  } catch (error) {
    res.status(401).json({ message: jwtErrors[error.name] ?? error.name })
  }
}
// export const isModerator = async (req, res, next) => {
//   const role = 'Moderator'
//   const user = await User.findOne({ _id: req.userId }, { noNeededInfo }).populate('roles')
//   for (const role of user.roles) {
//     if (role.name === role) {
//       next()
//       return
//     }
//   }
//   returnRoleRequire({ res, role })
//   // res.status(403).json(getMessageResponse({ role: 'Moderator' }))
// }
// export const isAdmin = async (req, res, next) => {
//   const role = 'Admin'
//   const user = await User.findOne({ _id: req.userId }, { noNeededInfo }).populate('roles')
//   for (const role of user.roles) {
//     if (role.name === role) {
//       next()
//       return
//     }
//   }
//   returnRoleRequire({ res, role })
//   // res.status(403).json(getMessageResponse({ role: 'Admin' }))
// }
// export const isSeller = async (req, res, next) => {
//   const role = 'Seller'
//   const user = await User.findOne({ _id: req.userId }, { noNeededInfo }).populate('roles')
//   for (const Role of user.roles) {
//     if (Role.name === role) {
//       next()
//       return
//     }
//   }
//   returnRoleRequire({ res, role })
//   // res.status(403).json(getMessageResponse({ role: 'Seller' }))
// }

const returnRoleRequire = ({ res, role }) => {
  res.status(403).json({ message: `Require ${role} Role` })
}

export const roleValidation = async (req, res, next) => {
  const { roleRequire: role } = req.body
  const user = await User.findOne({ _id: req.userId }, { noNeededInfo }).populate('roles')
  for (const Role of user.roles) {
    if (Role.name === role) {
      next()
      return
    }
  }
  returnRoleRequire({ res, role })
}
