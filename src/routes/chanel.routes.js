const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../controllers/auth.controller');
const {
  getChanelById,
  getAllChanels,
  createChanel,
  updateChanel,
  deleteChanel,
} = require('../controllers/chanel.controller');

router.use(protect);

router.route('').get(getAllChanels).post(restrictTo('admin'), createChanel);

router
  .route('/:id')
  .get(getChanelById)
  .patch(updateChanel)
  .delete(restrictTo('admin'), deleteChanel);

module.exports = router;
