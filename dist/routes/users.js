"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var userController = _interopRequireWildcard(require("../controllers/users"));

var authorization = _interopRequireWildcard(require("../middlewares/authorization"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import multer from 'multer'
const router = (0, _express.Router)(); // const store = multer.diskStorage({
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

router.get('/', [authorization.tokenVerification, authorization.isModerator], userController.getAllUsers);
router.get('/:userId', [authorization.tokenVerification], userController.getUserInfo);
router.put('/:userId', [authorization.tokenVerification, authorization.isModerator], userController.updateUser);
router.delete('/:userId', [authorization.tokenVerification, authorization.isAdmin], userController.deleteUser);
router.post('/photo/:userId', [authorization.tokenVerification,
/*  upload.single('avatar'),  */
userController.prepareToUpdateImage], userController.updateUser);
var _default = router;
exports.default = _default;