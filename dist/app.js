"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _package = _interopRequireDefault(require("../package.json"));

var _places = _interopRequireDefault(require("./routes/places"));

var _authentication = _interopRequireDefault(require("./routes/authentication"));

var _users = _interopRequireDefault(require("./routes/users"));

var _initSetup = require("./libs/initSetup");

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import morgan from 'morgan'
//  import { randomBytes } from 'crypto'
const app = (0, _express.default)();
(0, _config.createFolder)(['uploads/profile']);
(0, _initSetup.createRoles)(); //  console.log(randomBytes(64).toString('hex'))

app.set('pkg', _package.default); // app.use(morgan('dev'))

app.use(_express.default.json());
app.use('/gallery/profile', _express.default.static('./uploads/profile'));
app.get('/', (req, res) => {
  const {
    name,
    author,
    description,
    version
  } = app.get('pkg');
  res.json({
    author,
    name,
    description,
    version
  });
});
app.use('/api/places', _places.default);
app.use('/api/authentication', _authentication.default);
app.use('/api/users', _users.default);
var _default = app;
exports.default = _default;