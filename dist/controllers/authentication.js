"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUp = exports.login = exports.forgotPassword = exports.changePassword = void 0;

var _users = _interopRequireDefault(require("../models/users"));

var _roles = _interopRequireDefault(require("../models/roles"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signUp = async (req, res) => {
  const {
    email,
    password,
    fullName,
    roles
  } = req.body;
  const existingUser = await _users.default.findOne({
    email
  });
  if (existingUser) return res.json({
    message: 'Ese correo ya esta registrado'
  });
  const newUser = new _users.default({
    email,
    password: await _users.default.encryptPassword(password),
    fullName
  });

  if (roles) {
    const foundRoles = await _roles.default.find({
      name: {
        $in: roles
      }
    });
    newUser.roles = foundRoles.map(role => role._id);
  } else {
    const role = await _roles.default.findOne({
      name: 'User'
    });
    newUser.roles = [role._id];
  }

  const savedUser = await newUser.save();

  const token = _jsonwebtoken.default.sign({
    id: savedUser._id
  }, process.env.TOKEN_SECRET, {
    expiresIn: 86400
  });

  res.json({
    token
  });
};

exports.signUp = signUp;

const login = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const existingUser = await _users.default.findOne({
    email
  }); //  const existingUser = await User.findOne({ email }).populate('roles')

  if (!existingUser) return res.status(400).json({
    message: 'Ese correo electrónico no está registrado'
  });
  const matchedPassword = await _users.default.verifyPassword(password, existingUser.password);
  if (!matchedPassword) return res.status(401).json({
    message: 'Verifíque el correo o la contraseña'
  });

  const token = _jsonwebtoken.default.sign({
    id: existingUser._id
  }, process.env.TOKEN_SECRET, {
    expiresIn: 86400
  });

  res.json({
    token
  });
};

exports.login = login;

const changePassword = async (req, res) => {
  const {
    email,
    password,
    newPassword,
    newPasswordConfirmation
  } = req.body;
  if (!email) return res.json({
    message: 'No se proporcionó correo'
  });
  const existingUser = await _users.default.findOne({
    email
  });
  if (!existingUser) return res.status(400).json({
    message: 'Ese correo electrónico no está registrado'
  });
  const matchedPassword = await _users.default.verifyPassword(password, existingUser.password);
  if (!matchedPassword) return res.status(401).json({
    message: 'La contraseña actual es erronea'
  });
  if (newPassword !== newPasswordConfirmation) return res.status(401).json({
    message: 'Nueva contraseña y confirmacion de nueva contraseña no coinciden'
  });
  existingUser.password = await _users.default.encryptPassword(newPassword);
  const userUpdated = await _users.default.findOneAndUpdate({
    _id: existingUser._id
  }, existingUser, {
    new: true
  });
  res.json({
    userUpdated
  });
};

exports.changePassword = changePassword;

const forgotPassword = (req, res) => {
  const {
    email
  } = req.body;
  res.json({
    message: `Sending email to ${email}`
  });
};

exports.forgotPassword = forgotPassword;