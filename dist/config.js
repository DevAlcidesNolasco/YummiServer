"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFolder = void 0;

var _fs = require("fs");

var _path = require("path");

const createFolder = folders => {
  for (const folder of folders) {
    const path = `./${folder}`;
    (0, _fs.access)(path, error => {
      if (error) {
        const newPath = (0, _path.join)(__dirname, `.${path}`);
        (0, _fs.mkdir)(newPath, {
          recursive: true
        }, e => {
          if (e) {
            return console.error(e);
          }

          console.log(`${folder} Path Created`);
        });
      }
    });
  }
};

exports.createFolder = createFolder;