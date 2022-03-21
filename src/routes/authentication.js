import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import * as authenticationController from '../controllers/authentication'
const router = Router()

const getErrorMessageArray = (array) => array.map((error) => error.msg)

const validations = {
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

router.post('/register', [
  validations.email(),
  validations.password(),
  validations.fullName(),
  validations.roles()
], validations.errors, authenticationController.signUp)

router.post('/login', [
  validations.email(),
  validations.password()
], validations.errors, authenticationController.login)

router.post('/resetPassword', authenticationController.changePassword)

router.post('/forgotPassword', authenticationController.forgotPassword)

export default router
