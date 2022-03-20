"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mongooseOptions = {
  dbName: 'WTE',
  useNewUrlParser: true,
  useUnifiedTopology: true // useCreateIndex: true

};

_mongoose.default.connect('mongodb://localhost:27017', mongooseOptions).then(() => {
  console.info('DB connected');
}).catch(err => {
  console.error(err);
});