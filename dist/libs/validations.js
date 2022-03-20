"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidObjectId = void 0;

const isValidObjectId = id => id.match(/^[0-9a-fA-F]{24}$/);

exports.isValidObjectId = isValidObjectId;