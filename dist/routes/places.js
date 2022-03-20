"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var placesController = _interopRequireWildcard(require("../controllers/places"));

var authorization = _interopRequireWildcard(require("../middlewares/authorization"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const router = (0, _express.Router)();
router.get('/', placesController.getPlaces);
router.get('/similar/:placeId', [authorization.tokenVerification], placesController.similarPlaces);
router.get('/recommendations/:placeId', [authorization.tokenVerification], placesController.recommendedPlaces);
router.get('/likes', [authorization.tokenVerification], placesController.getLikes);
router.get('/:placeId', placesController.getPlace);
router.post('/', [authorization.tokenVerification, authorization.isModerator], placesController.createPlace);
router.post('/like/:placeId', [authorization.tokenVerification], placesController.likeAPlace);
router.put('/:placeId', [authorization.tokenVerification, authorization.isSeller], placesController.putPlace);
router.delete('/:placeId', [authorization.tokenVerification, authorization.isAdmin]);
var _default = router;
exports.default = _default;