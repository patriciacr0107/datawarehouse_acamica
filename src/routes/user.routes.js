const express = require('express');
const router = express.Router();

// Controlador para la gestión de usuarios
const {
  signup,
  signin,
  protect,
  restrictTo,
} = require('../controllers/auth.controller');

//Controlador para proceso de registro y autenticación
const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  getUserByDoc,
  getFilter,
  // getMe,
} = require('../controllers/user.controller');
router.route('/sign-in').post(signin);

router.use(protect);
router.route('/sign-up').post(restrictTo('admin'), signup);

router.route('/').get(getAllUsers);
router.route('/filter').get(getFilter);

router
  .route('/:id')
  .get(getUser)
  .delete(restrictTo('admin'), deleteUser)
  .patch(updateUser);

router.route('/document/:id').get(restrictTo('user'), getUserByDoc);

module.exports = router;
