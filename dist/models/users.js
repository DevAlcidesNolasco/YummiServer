"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  fullName: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  roles: [{
    ref: 'Role',
    type: _mongoose.Schema.Types.ObjectId
  }],
  photoUrl: {
    type: String,
    default: 'http://localhost:3000/users/photo/default.png'
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.statics.encryptPassword = async password => {
  const salt = await _bcrypt.default.genSalt(12);
  return await _bcrypt.default.hash(password, salt);
};

userSchema.statics.verifyPassword = async (password, hash) => {
  return await _bcrypt.default.compare(password, hash);
};

var _default = (0, _mongoose.model)('User', userSchema);

exports.default = _default;