import { Router } from 'express'
import { roleAssign, place as placeValidator } from '../libs/validations'
import { roleValidation, tokenVerification } from '../middlewares/authorization'
import { getAllPlaces, getPlacesNear, createPlace, getPlaceById, updatePlace } from '../controllers/places'
const router = Router()

// END POINTS
// +  obtener todos los lugares
// +  obtener lugares cerca
// +  obtener lugar por ID
// +  crear un nuevo lugar
// +  editar un lugar
// +  eliminiar un lugar
// +  interaccion like a un lugar
// +  mostrar lugares recomendados segun gustos de usuario
// +  mostrar lugares recomendados segun categorias de lugar principal
// +  mostrar lugares similares a lugar referente

router.route('/')
  .get(getPlacesNear)
  .post([], createPlace)

router.route('/all')
  .all([
    (req, res, next) => roleAssign({ req, next, roles: ['Moderator', 'Admin'] }),
    tokenVerification,
    roleValidation
  ])
  .get(getAllPlaces)

router.route('/:placeId')
  .all([
    placeValidator.placeId()
  ], placeValidator.errors)
  .get(getPlaceById)
  .put([
    (req, res, next) => roleAssign({ req, next, roles: ['Moderator', 'Admin', 'Seller'] }),
    tokenVerification,
    roleValidation
  ], updatePlace)
  .delete([
    (req, res, next) => roleAssign({ req, next, roles: ['Moderator', 'Admin', 'Seller'] }),
    tokenVerification,
    roleValidation
  ])

// router.route('/likes').get()

// router
//   .get('/similar/:placeId', [
//     tokenVerification
//   ], placesController.similarPlaces)

// router
//   .get('/recommendations/:placeId', [
//     tokenVerification
//   ], placesController.recommendedPlaces)

// // router.get('/likes', [
// //   tokenVerification
// // ], placesController.getLikes)

// router.route('/:placeId')
//   .get(placesController.getPlace)
//   .put([tokenVerification], placesController.putPlace)
//   .delete([tokenVerification])

// router.post('/like/:placeId', [
//   tokenVerification
// ], placesController.likeAPlace)

// router.put('/:placeId', [
//   tokenVerification
//   // authorization.isSeller
// ], placesController.putPlace)

// router.delete('/:placeId', [
//   tokenVerification
//   // authorization.isAdmin
// ])

export default router
