import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import * as authenticationController from '../controllers/authentication'
const router = Router()

const getErrorMessageArray = (array) => array.map((error) => error.msg)

const validations = {
  email: () => body('email').trim().isEmail().withMessage('Formato de correo incorrecto').normalizeEmail(),
  password: () => body('password').trim().isAlphanumeric().withMessage('No cumple regla: Solo numero y letras').isStrongPassword({ minSymbols: 0 }).withMessage('No cumple regla: Debe ser una constraseña fiable'),
  fullName: () => body('fullName').trim().notEmpty().isString(),
  errors: (req, res, next) => {
    const { errors } = validationResult(req)
    if (errors.length > 0) return res.json({ errors: getErrorMessageArray(errors) })
    next()
  }
}

router.post('/register', [validations.email(), validations.password(), validations.fullName()], validations.errors, authenticationController.signUp)
router.post('/login', [validations.email(), validations.password()], validations.errors, authenticationController.login)
router.post('/resetPassword', authenticationController.changePassword)
router.post('/forgotPassword', authenticationController.forgotPassword)

export default router
