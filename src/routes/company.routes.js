const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../controllers/auth.controller');
const {
  getCompanyById,
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getFilter,
} = require('../controllers/company.controller');

router.use(protect);

router.route('').get(getAllCompanies).post(createCompany);

router.route('/filter').get(getFilter);

router
  .route('/:id')
  .get(getCompanyById)
  .patch(restrictTo('admin'), updateCompany)
  .delete(restrictTo('admin'), deleteCompany);

module.exports = router;
