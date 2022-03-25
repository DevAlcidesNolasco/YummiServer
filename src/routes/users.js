import { Router } from 'express'
import * as userController from '../controllers/users'
import { roleAssign, user as userValidator } from '../libs/validations'
import { roleValidation, tokenVerification } from '../middlewares/authorization'
const router = Router()

router.route('/')
  .all([
    (req, res, next) => roleAssign({ req, next, roles: ['Moderator', 'Admin'] }),
    tokenVerification,
    roleValidation
  ])
  .get(userController.getAllUsers)

router.route('/roles')
  .all([
    (req, res, next) => roleAssign({ req, next, roles: ['Admin'] }),
    tokenVerification,
    roleValidation
  ])
  .get(userController.getUserRoles)

router.route('/:userId')
  .all([
    (req, res, next) => roleAssign({ req, next, roles: ['Moderator', 'Admin', 'User'] }),
    tokenVerification,
    roleValidation,
    userValidator.userId()
  ], userValidator.errors)
  .get(userController.getUserById)
  .put(userController.updateUserById)
  .delete(userController.deleteUserById)

export default router
