const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../controllers/auth.controller');
const {
  getCountryById,
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  deleteMany
} = require('../controllers/country.controller');

router.use(protect);

router.route('').get(getAllCountries).post(restrictTo('admin'), createCountry);

router
  .route('/:id')
  .get(getCountryById)
  .patch(restrictTo('admin'), updateCountry)
  .delete(restrictTo('admin'), deleteCountry);

router.route('/delete-countires/region/:id').delete(deleteMany);

module.exports = router;
