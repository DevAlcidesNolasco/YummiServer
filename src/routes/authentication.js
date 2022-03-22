import { Router } from 'express'
import { auth as authValidator, roleAssign } from '../libs/validations'
import { roleValidation, tokenVerification } from '../middlewares/authorization'
import * as authController from '../controllers/authentication'

const router = Router()

router.post('/register', [
  authValidator.email(),
  authValidator.password(),
  authValidator.fullName(),
  authValidator.roles()
], authValidator.errors, authController.register)

router.post('/login', [
  authValidator.email(),
  authValidator.password()
], authValidator.errors, authController.login)

router.post('/resetPassword', [
  (req, res, next) => roleAssign({ req, next, role: ['Admin', 'Moderator', 'Seller', 'User'] }),
  tokenVerification,
  roleValidation
]/*  , authController.changePassword */)

// router.post('/forgotPassword', authController.forgotPassword)

export default router
