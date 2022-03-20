"use strict";

require("dotenv/config");

var _app = _interopRequireDefault(require("./app"));

require("./database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'regenerator-runtime/runtime'
// import 'core-js/stable'
const PORT = process.env.NODE_PORT;

_app.default.listen(PORT);

console.info('Server listen on port', PORT);