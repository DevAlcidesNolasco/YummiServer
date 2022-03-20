//  import multer from 'multer';
//  export const upload = (path, fields) => {
//    const store = multer.diskStorage({
//        destination: (req, file, cb) => {
//            cb(null, path);
//        },
//        filename: (req, file, cb) => {
//            const uniqueName = Date.now()
//            cb(null, uniqueName);
//        }
//    });
//    const upload = multer({ storage: store });
//    fields
//    upload.array();
//  }
"use strict";