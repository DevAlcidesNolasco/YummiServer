import { Router } from 'express'
import * as userController from '../controllers/users'
import { roleAssign } from '../libs/validations'
import { roleValidation, tokenVerification } from '../middlewares/authorization'

// import multer from 'multer'
const router = Router()

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

router.get('/', [
  (req, res, next) => roleAssign({ req, next, roles: ['Moderator', 'Admin'] }),
  tokenVerification,
  roleValidation
], userController.getAllUsers)

router.get('/:userId', [
  (req, res, next) => roleAssign({ req, next, roles: ['Moderator', 'Admin', 'User'] }),
  tokenVerification,
  roleValidation
], userController.getUserInfo)

router.put('/:userId', [
  (req, res, next) => roleAssign({ req, next, role: ['Moderator', 'Admin', 'User'] }),
  tokenVerification,
  roleValidation
], userController.updateUser)

router.delete('/:userId', [
  (req, res, next) => roleAssign({ req, next, role: ['Moderator', 'Admin', 'User'] }),
  tokenVerification,
  roleValidation
], userController.deleteUser)

// router.post('/photo/:userId', [
//   tokenVerification, /*  upload.single('avatar'),  */
//   userController.prepareToUpdateImage
// ], userController.updateUser)

export default router
