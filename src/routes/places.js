import { Router } from 'express'
// import { roleAssign } from '../libs/validations'
import { /* roleValidation,   */ tokenVerification } from '../middlewares/authorization'
import * as placesController from '../controllers/places'
// import * as authorization from '../middlewares/authorization'
const router = Router()

router.route('/').get(placesController.getPlaces).post(placesController.createPlace)

router.route('/:placeId').get(placesController.getPlace).put([tokenVerification], placesController.putPlace).delete([tokenVerification])

router.route('/likes').get()

router.get('/similar/:placeId', [
  tokenVerification
], placesController.similarPlaces)

router.get('/recommendations/:placeId', [
  tokenVerification
], placesController.recommendedPlaces)

// router.get('/likes', [
//   tokenVerification
// ], placesController.getLikes)

router.route('/:placeId')
  .get(placesController.getPlace)
  .put([tokenVerification], placesController.putPlace)
  .delete([tokenVerification])

router.post('/like/:placeId', [
  tokenVerification
], placesController.likeAPlace)

// router.put('/:placeId', [
//   tokenVerification
//   // authorization.isSeller
// ], placesController.putPlace)

// router.delete('/:placeId', [
//   tokenVerification
//   // authorization.isAdmin
// ])

export default router
