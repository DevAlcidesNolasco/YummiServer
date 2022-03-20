"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenVerification = exports.isSeller = exports.isModerator = exports.isAdmin = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _users = _interopRequireDefault(require("../models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const noNeededInfo = {
  password: 0,
  photoUrl: 0,
  email: 0,
  fullName: 0,
  createdAt: 0,
  updatedAt: 0
};

const tokenVerification = async (req, res, next) => {
  const {
    authorization
  } = req.headers;
  if (!authorization) return res.status(403).json({
    message: 'No token provided'
  });

  try {
    const decoded = _jsonwebtoken.default.verify(authorization, process.env.TOKEN_SECRET);

    req.userId = decoded?.id; //  console.log(`userId is ${req.userId}`)

    const userFound = await _users.default.findOne({
      _id: decoded?.id
    }, {
      password: 0
    });
    if (!userFound) return res.status(404).json({
      message: 'User doesnt exist'
    });
    next();
  } catch (error) {
    //  console.error(error)
    if (error.name === 'TokenExpiredError') res.status(401).json({
      message: 'Token Expired'
    });
    if (error.name === 'JsonWebTokenError') res.status(401).json({
      message: 'Token Invalido'
    });
  }
};

exports.tokenVerification = tokenVerification;

const isModerator = async (req, res, next) => {
  const user = await _users.default.findOne({
    _id: req.userId
  }, {
    noNeededInfo
  }).populate('roles');

  for (const role of user.roles) {
    if (role.name === 'Moderator') {
      next();
      return;
    }
  }

  res.status(403).json(getMessageResponse({
    role: 'Moderator'
  }));
};

exports.isModerator = isModerator;

const isAdmin = async (req, res, next) => {
  const user = await _users.default.findOne({
    _id: req.userId
  }, {
    noNeededInfo
  }).populate('roles');

  for (const role of user.roles) {
    if (role.name === 'Admin') {
      next();
      return;
    }
  }

  res.status(403).json(getMessageResponse({
    role: 'Admin'
  }));
};

exports.isAdmin = isAdmin;

const isSeller = async (req, res, next) => {
  const user = await _users.default.findOne({
    _id: req.userId
  }, {
    noNeededInfo
  }).populate('roles');

  for (const role of user.roles) {
    if (role.name === 'Seller') {
      next();
      return;
    }
  }

  res.status(403).json(getMessageResponse({
    role: 'Seller'
  }));
};

exports.isSeller = isSeller;

const getMessageResponse = ({
  role
}) => {
  return {
    message: `Require ${role} Role`
  };
}; // (getMessageResponse('admin'))()