"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.similarPlaces = exports.removePlace = exports.recommendedPlaces = exports.putPlace = exports.likeAPlace = exports.getPlaces = exports.getPlace = exports.getLikes = exports.createPlace = void 0;

var _places = _interopRequireDefault(require("../models/places"));

var _validations = require("../libs/validations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getPlaces = async (req, res) => {
  // obtener distancia, ubicacion, y filtros de la busqueda
  // validar datos de entrada
  // buscar en la base de datos los sitios cercanos
  // contar el resultado
  const {
    distance = 300,
    coordinates = [13.482903, -88.175427]
  } = req.body;

  if (typeof distance !== 'number') {
    return res.json({
      message: 'Dato de la distancia erroneo'
    });
  }

  if (typeof coordinates !== 'object' || coordinates.length < 2) {
    return res.json({
      message: 'No ha proporcionado ubicación'
    });
  }

  const {
    filters = {
      delivery: null,
      service: null
    }
  } = req.body;
  const places = await _places.default.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: distance
      }
    }
  });
  const isFiltered = Object.values(filters).some(filterValue => filterValue !== null);
  console.log(isFiltered); // const arrayFilters = Object.entries(filters)
  // arrayFilters.forEach((filter) => {
  //     if (filter[1]) {
  //         console.log(filter[1])
  //         places.where(filter[0], filter[1])
  //     }
  // })

  res.json({
    result: places,
    count: places.length
  });
};

exports.getPlaces = getPlaces;

const createPlace = async (req, res) => {
  // obtener informacion de las propiedades del sitio
  // guarda en la base de datos el sitio
  const preparedPlace = new _places.default(req.body);
  const savedPlace = await preparedPlace.save();
  res.status(201).json(savedPlace);
};

exports.createPlace = createPlace;

const putPlace = async (req, res) => {
  // obtener ID del sitio
  // obtener objeto con nuevas valores del sitio
  // actualizar el sitio con ID
  const {
    placeId
  } = req.params;

  if (!placeId) {
    return res.json({
      message: 'No ha proporcionado id del lugar'
    });
  }

  if (!(0, _validations.isValidObjectId)(placeId)) {
    return res.json({
      message: 'El id del lugar no es valido'
    });
  }

  const updatedPlace = await _places.default.replaceOne({
    _id: placeId
  }, req.body);

  if (updatedPlace.n === 0) {
    return res.json({
      message: 'No existe ese lugar'
    });
  }

  if (updatedPlace.nModified === 0) {
    return res.json({
      message: 'No se pudo editar el lugar'
    });
  }

  res.json(updatedPlace);
};

exports.putPlace = putPlace;

const removePlace = async (req, res) => {
  // obtener ID del sitio
  // eliminar un sitio con ID
  const {
    placeId
  } = req.params;

  if (!placeId) {
    return res.json({
      message: 'No ha proporcionado id del lugar'
    });
  }

  if (!(0, _validations.isValidObjectId)(placeId)) {
    return res.json({
      message: 'El id del lugar no es valido'
    });
  }

  const placeDeleted = await _places.default.findOneAndDelete({
    _id: placeId
  }); //  const placeDeleted = await Place.findByIdAndRemove(placeId)

  if (!placeDeleted) {
    return res.json({
      message: 'No existe ese lugar'
    });
  }

  res.json(placeDeleted);
};

exports.removePlace = removePlace;

const getPlace = async (req, res) => {
  // obtener ID del sitio
  // obtener informacion del sitio con el ID
  const {
    placeId
  } = req.params;

  if (!placeId) {
    return res.json({
      message: 'No ha proporcionado id del lugar'
    });
  }

  if (!(0, _validations.isValidObjectId)(placeId)) {
    return res.json({
      message: 'El id del lugar no es valido'
    });
  }

  const placeFound = await _places.default.findOne({
    _id: placeId
  });

  if (!placeFound) {
    return res.json({
      message: 'No existe ese lugar'
    });
  }

  res.json(placeFound);
};

exports.getPlace = getPlace;

const recommendedPlaces = (req, res) => {
  // buscar los cercanos con las categorias mas buscadas del usuario
  // obtener categorias mas buscadas
  // filtrar por los mejores valorados
  const {
    placeId
  } = req.params;
  console.log(`Id Place is ${placeId}`);
  console.log(req.body);
  res.json({
    message: 'Get Recommended Places'
  });
};

exports.recommendedPlaces = recommendedPlaces;

const similarPlaces = async (req, res) => {
  // obtener ID del sitio
  // obtener categorias del sitio
  // buscar sitios con las categorias del ID
  const {
    placeId
  } = req.params;

  if (!placeId) {
    return res.json({
      message: 'No ha proporcionado id del lugar'
    });
  }

  if (!(0, _validations.isValidObjectId)(placeId)) {
    return res.json({
      message: 'El id del lugar no es valido'
    });
  }

  const placeFound = await _places.default.findOne({
    _id: placeId
  }, {
    gallery: 0,
    contact: 0,
    description: 0,
    ubication: 0,
    rating: 0,
    schedule: 0,
    name: 0
  });
  searchByCategories(placeFound.category);
  res.json({
    message: 'Get Similar in 500mts Places'
  });
};

exports.similarPlaces = similarPlaces;

const getLikes = async (req, res) => {
  // obtener el ID del usuario
  // obtener todos los sitios que el usuario ha likeado
  const {
    userId
  } = req;
  console.log(userId);
  const likedPlaces = await _places.default.find({
    rating: {
      $elemMatch: {
        user: userId
      }
    }
  }); //  console.log('Get Liked Places')

  res.json(likedPlaces);
};

exports.getLikes = getLikes;

const likeAPlace = async (req, res) => {
  // obtener ID del sitio y el usuario
  // obtener el valor del Rating
  // obtener sitio del ID
  // modificar el arreglo con los likes del sitio
  const {
    rating
  } = req.body;
  const {
    userId
  } = req;
  const {
    placeId
  } = req.params;

  if (!(0, _validations.isValidObjectId)(placeId)) {
    return res.json({
      message: 'El id del lugar no es valido'
    });
  }

  if (rating > 5 || rating < 0 || !rating || isNaN(rating)) {
    return res.json({
      message: 'Calificacion no valida'
    });
  }

  const place = await _places.default.findOne({
    _id: placeId
  });
  const found = place.rating.findIndex(rate => rate.user.toString() === userId);

  if (found > -1) {
    place.rating[found].rate = rating;
  } else {
    place.rating.push({
      user: userId,
      rate: rating
    });
  }

  const ratingSaved = await place.save();
  res.json(ratingSaved);
};

exports.likeAPlace = likeAPlace;

const searchByCategories = categories => {
  for (const category of categories) {
    console.log(category);
  }
};