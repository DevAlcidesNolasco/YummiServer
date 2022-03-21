import { Router } from 'express'
import * as userController from '../controllers/users'
import * as authorization from '../middlewares/authorization'
import { roleAssign } from '../libs/validations'
// import multer from 'multer'
const router = Router()

// const roleAssign = (req, res, next, role) => {
//   req.body.roleRequire = role
//   next()
// }

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
  authorization.tokenVerification,
  (req, res, next) => {
    roleAssign({ req, res, next, role: 'Moderator' })
  }
  // authorization.isModerator
], userController.getAllUsers)

router.get('/:userId', [
  authorization.tokenVerification
], userController.getUserInfo)

router.put('/:userId', [
  authorization.tokenVerification,
  (req, res, next) => {
    return roleAssign({ req, res, next, role: 'Moderator' })
  },
  authorization.roleValidation/* authorization.isModerator */
], userController.updateUser)

router.delete('/:userId', [
  authorization.tokenVerification
  // authorization.isAdmin
], userController.deleteUser)

router.post('/photo/:userId', [
  authorization.tokenVerification, /*  upload.single('avatar'),  */
  userController.prepareToUpdateImage
], userController.updateUser)

export default router
