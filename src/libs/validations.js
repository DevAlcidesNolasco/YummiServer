import { body, validationResult } from 'express-validator'
import { Types } from 'mongoose'
const { ObjectId } = Types

const getErrorMessageArray = (array) => array.map((error) => error.msg)

export const objectIdValidation = (req, res, next) => {
  let { userId } = req.params
  try {
    if (userId instanceof Object) return res.status(400).json({ error: 'Parametro id is an object' })
    userId = new ObjectId(userId)
    if (!ObjectId.isValid(userId)) return res.status(400).json({ error: 'Parametro id invalido' })
    return next()
    // console.info(userId)
  } catch (error) {
    return res.json({ error: 'Parametro id invalido' })
  }
}

export const roleAssign = ({ req, next, roles }) => {
  req.body.rolesRequire = roles
  return next()
}

export const food = {}

export const place = {}

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
  errors: (req, res, next) => {
    const { errors } = validationResult(req)
    if (errors.length > 0) return res.json({ errors: getErrorMessageArray(errors) })
    next()
  }
}
