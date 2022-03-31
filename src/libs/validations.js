import { body, param, validationResult } from 'express-validator'
import { Types } from 'mongoose'
const { ObjectId } = Types

const throwErrors = (req, res, next) => {
  const { errors } = validationResult(req)
  if (errors.length > 0) return res.json({ error: errors.map((error) => error.msg) })
  next()
}

const idValid = ({ id }) => {
  try {
    id = new ObjectId(id)
    if (!ObjectId.isValid(id)) return false
    return true
  } catch (error) {
    return false
  }
}

export const roleAssign = ({ req, next, roles }) => {
  req.body.rolesRequire = roles
  return next()
}

export const user = {
  userId: () => param('userId').custom((value) => idValid({ id: value })).withMessage('Parametro id no valido'),
  errors: throwErrors
}

export const food = {}

export const place = {
  placeId: () => param('placeId').custom((value) => idValid({ id: value })).withMessage('Parametro id no valido'),
  errors: throwErrors
}

export const auth = {
  email: () => body('email').trim().isEmail().withMessage('Formato de correo incorrecto').normalizeEmail(),
  password: () => body('password').trim().isAlphanumeric().withMessage('Contrasenña no cumple regla: Solo numero y letras').isStrongPassword({ minSymbols: 0 }).withMessage('Contraseña no cumple regla: Debe ser una constraseña fiable'),
  fullName: () => body('fullName').trim().notEmpty().isString(),
  roles: () => {
    return body('roles').custom((value, { req }) => {
      const roles = ['Admin', 'Moderator', 'Seller', 'User']
      if (value === undefined) return true
      if (!Array.isArray(value)) return false
      if (!value.length > 0) return false
      return value.every(element => roles.includes(element))
    }).withMessage('Roles asignados no validos')
  },
  errors: throwErrors
}
