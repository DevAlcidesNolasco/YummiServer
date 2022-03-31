import jwt from 'jsonwebtoken'
import User from '../models/users'
import { Types } from 'mongoose'

const { ObjectId } = Types
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
  TokenExpiredError: 'Token de usuario expiró',
  JsonWebTokenError: 'Token de usuario invalido'
}

export const tokenVerification = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) return res.status(403).json({ error: 'No token provided' })
  jwt.verify(authorization, TOKEN_SECRET, async function (err, decoded) {
    if (err) return res.status(401).json({ error: jwtErrors[err.name] ?? err.name })
    let { id } = decoded
    if (!id) return res.json({ error: 'Formato interno del token no valido' })
    try {
      id = new ObjectId(id)
    } catch (exception) {
      return res.status(401).json({ error: 'error en el id' })
    }
    const userFound = await User.findOne({ _id: id }, { password: 0 })
    if (!userFound) return res.status(404).json({ error: 'Credencial invalida' })
    req.body.sessionUId = id
    return next()
  })
}

export const roleValidation = async (req, res, next) => {
  const { rolesRequire } = req.body
  const { sessionUId } = req.body
  const rolesArray = rolesRequire ?? ['Admin']
  const { roles } = await User.findOne({ _id: sessionUId }, { noNeededInfo }).populate('roles')
  const rolesUser = roles.map((data) => data.name)
  if (!rolesArray.some((roleRequire) => {
    return rolesUser.includes(roleRequire)
  })) return res.status(403).json({ error: 'Rol asignado no autorizado' })
  return next()
}
