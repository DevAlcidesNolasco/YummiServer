import { Router } from 'express'
import * as authenticationController from '../controllers/authentication'
const router = Router()
router.post('/signup', authenticationController.signUp)
router.post('/login', authenticationController.login)
router.post('/resetPassword', authenticationController.changePassword)
router.post('/forgotPassword', authenticationController.forgotPassword)

export default router
