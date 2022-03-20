"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.prepareToUpdateImage = exports.getUserInfo = exports.getAllUsers = exports.deleteUser = void 0;

var _users = _interopRequireDefault(require("../models/users"));

var _validations = require("../libs/validations");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getUserInfo = async (req, res) => {
  const {
    userId
  } = req.params;
  if (!userId) return res.json({
    message: 'No se ha proporcionado id de usuario'
  });
  if (!(0, _validations.isValidObjectId)(userId)) return res.json({
    message: 'Id no valido'
  });
  const userFound = await _users.default.findOne({
    _id: userId
  }, {
    password: 0
  });
  res.json(userFound);
};

exports.getUserInfo = getUserInfo;

const getAllUsers = async (req, res) => {
  res.json(await _users.default.find({}, {
    password: 0,
    createdAt: 0,
    updatedAt: 0
  }).populate('roles'));
};

exports.getAllUsers = getAllUsers;

const updateUser = async (req, res) => {
  const {
    userId
  } = req.params;
  const {
    body
  } = req;
  if (!userId) return res.json({
    message: 'No se ha proporcionado id de usuario'
  });
  if (!(0, _validations.isValidObjectId)(userId)) return res.json({
    message: 'Id no valido'
  }); //  if (req.userId === userId) return res.json({ message: 'No se puede actualizar usted mismo' })

  console.log('updateUser', body);
  const userUpdated = await _users.default.findOneAndUpdate({
    _id: userId
  }, body, {
    new: true
  });
  res.json({
    userUpdated
  });
};

exports.updateUser = updateUser;

const deleteUser = async (req, res) => {
  const {
    userId
  } = req.params;
  if (!userId) return res.json({
    message: 'No se ha proporcionado id de usuario'
  });
  if (!(0, _validations.isValidObjectId)(userId)) return res.json({
    message: 'Id no valido'
  });
  if (req.userId === userId) return res.json({
    message: 'No se puede eliminar usted mismo'
  });
  const userDeleted = await _users.default.findOneAndDelete({
    _id: userId
  });
  if (!userDeleted) return res.json({
    message: 'Usuario no existe'
  });
  res.json(userDeleted);
};

exports.deleteUser = deleteUser;

const prepareToUpdateImage = (req, res, next) => {
  const {
    file
  } = req;
  const {
    filename
  } = file;
  const photoUrl = `${req.protocol}://${req.get('host')}/gallery/profile/${filename}`;
  req.body = {
    photoUrl
  };
  next();
};

exports.prepareToUpdateImage = prepareToUpdateImage;