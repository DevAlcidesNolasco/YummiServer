import { Router } from 'express'
import * as userController from '../controllers/users'
import { roleAssign, objectIdValidation } from '../libs/validations'
import { roleValidation, tokenVerification } from '../middlewares/authorization'
const router = Router()

router.route('/')
  .all([
    (req, res, next) => roleAssign({ req, next, roles: ['Moderator', 'Admin'] }),
    tokenVerification,
    roleValidation
  ])
  .get(userController.getAllUsers)
  // .put(userController.updateAllUsers)

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
    objectIdValidation
  ])
  .get(userController.getUserById)
  .put(userController.updateUserById)
  .delete(userController.deleteUserById)

export default router

// import multer from 'multer'
// const store = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/profile')
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now().toString()
//     const extension = file.originalname.split('.').at(-1)
//     cb(null, `${uniqueName}.${extension}`)
//   }
// })
// const upload = multer({ storage: store })

// router.post('/photo/:userId', [
//   tokenVerification, /*  upload.single('avatar'),  */
//   userController.prepareToUpdateImage
// ], userController.updateUser)
