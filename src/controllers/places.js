import Place from '../models/places'
import User from '../models/users'
// import { isValidObjectId } from '../libs/validations'

const errorHandler = ({ error }) => {
  const { errors } = error
  const errorArray = Object.entries(errors)
  return {
    error: errorArray.map((err) => {
      return err[1].message
    })
  }
}

export const getAllPlaces = async (req, res) => {
  const places = await Place.find({})
  if (!places) return res.json({ error: 'No se pudo recopilar información' })
  return res.json({ places })
}

export const getPlacesNear = async (req, res) => {
  let { distance = 300 } = req.body
  const { coordinates = [13.482903, -88.175427] } = req.body
  distance = parseInt(distance, 10)
  const distanceIsInteger = Number.isInteger(distance)
  const coordinatesIsAnArrayValid = Array.isArray(coordinates) && coordinates.length === 2
  if (!(distanceIsInteger && coordinatesIsAnArrayValid)) return res.status(400).json({ error: 'Parametros incorrectos' })
  const places = await Place.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: distance
      }
    }
  })
  return res.status(200).json({ result: places })
}

export const createPlace = async (req, res) => {
  let { place } = req.body
  place = new Place({ ...place })
  place.save(function (error) {
    if (error) return res.status(400).json(errorHandler({ error }))
    return res.status(200).json(place)
  })
}

export const updatePlaceById = async (req, res) => {
  const { placeId } = req.params
  const { place } = req.body
  delete place._id
  const updatedPlace = await Place.findOneAndUpdate({ _id: placeId }, { $set: { ...place } }, { new: true })
  if (!updatedPlace) return res.json({ error: 'No se pudo realizar la accion' })
  return res.status(200).json({
    place: updatedPlace,
    message: 'Se realizó accion exitosamente'
  })
}
export const deletePlaceById = async (req, res) => {
  const { placeId } = req.params
  const placeDeleted = await Place.findOneAndDelete({ _id: placeId }, { new: true })
  if (!placeDeleted) return res.json({ message: 'No existe ese lugar' })
  return res.status(200).json(placeDeleted)
}

export const getPlaceById = async (req, res) => {
  const { placeId } = req.params
  const placeFound = await Place.findOne({ _id: placeId })
  if (!placeFound) return res.json({ message: 'No existe ese lugar' })
  return res.status(200).json(placeFound)
}

export const recommendedPlaces = async (req, res) => {
  // obtener lugares que le gustan al usuario
  // sacar las categorias de los lugares gustados
  // buscar lugares por categorias iguales a las recuperadas
  // mostrar array al usuario
  const { sessionUId } = req.body
  const userFound = await User.findOne({ _id: sessionUId }, { password: 0, roles: 0 })
  if (!userFound) return res.json({ error: 'Usuario invalido' })
  const { likes } = userFound
  if (!likes) return res.json({ error: 'No se pudieron recuperar likes' })
  const { places } = likes
  if (!places) return res.json({ error: 'No se pudieron recuperar lugares gustados' })
  const placesLikeds = await Place.find({ _id: { $in: places.map(x => x._id) } })
  return res.status(200).json({
    message: 'Get Recommended Places by',
    places: placesLikeds,
    user: userFound
  })
}

export const similarPlaces = async (req, res) => {
  // obtener ID del sitio
  // obtener categorias del sitio
  // buscar sitios con las categorias del ID
  const { placeId } = req.params
  const placeFound = await Place.findOne({
    _id: placeId
  }, {
    gallery: 0,
    contact: 0,
    description: 0,
    ubication: 0,
    rating: 0,
    schedule: 0,
    name: 0
  })
  searchByCategories(placeFound.category)
  res.json({
    message: 'Get Similar in 500mts Places'
  })
}

export const getLikes = async (req, res) => {
  // obtener el ID del usuario
  // obtener todos los sitios que el usuario ha likeado
  const { userId } = req.body
  console.log(userId)
  const likedPlaces = await Place.find({
    rating: {
      $elemMatch: {
        user: userId
      }
    }
  })
  //  console.log('Get Liked Places')
  res.json(likedPlaces)
}

export const likeAPlace = async (req, res) => {
  const { placeId } = req.params
  const { sessionUId } = req.body
  const userFound = await User.findOne({ _id: sessionUId })
  const placeFound = await Place.findOne({ _id: placeId })
  if (!placeFound) return res.json({ error: 'No se pudo encontrar el lugar' })
  userFound.likes.places.push(placeId)
  userFound.save(function (error) {
    if (error) return res.status(400).json(errorHandler({ error }))
    return res.status(200).json(userFound)
  })
  // const pushAnItem = ({ item, array }) => {
  //   if (!Array.isArray(array)) {
  //     array = []
  //   }
  //   return [...array, item]
  // }
  // places = pushAnItem({ item: placeId, array: places })
  // return res.json({ message: userFound })

  // if ((rating > 5 || rating < 0) || !rating || isNaN(rating)) {
  //   return res.json({
  //     message: 'Calificacion no valida'
  //   })
  // }

  // const place = await Place.findOne({ _id: placeId })
  // const found = place.rating.findIndex((rate) => rate.user.toString() === userId)
  // if (found > -1) {
  //   place.rating[found].rate = rating
  // } else {
  //   place.rating.push({
  //     user: userId,
  //     rate: rating
  //   })
  // }
  // const ratingSaved = await place.save()
  // res.json(ratingSaved)
}
const searchByCategories = (categories) => {
  for (const category of categories) {
    console.log(category)
  }
}
