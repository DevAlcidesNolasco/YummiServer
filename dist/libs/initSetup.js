"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoles = void 0;

var _roles = _interopRequireDefault(require("../models/roles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createRoles = async () => {
  try {
    const countRoles = await _roles.default.estimatedDocumentCount();
    if (countRoles > 0) return;
    const values = await Promise.all([new _roles.default({
      name: 'Admin'
    }).save(), new _roles.default({
      name: 'Moderator'
    }).save(), new _roles.default({
      name: 'Seller'
    }).save(), new _roles.default({
      name: 'User'
    }).save()]);
    console.log(values);
  } catch (error) {
    console.error(error);
  }
};

exports.createRoles = createRoles;