const factory = require('./handlerFactory.controller');
const User = require('./../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Obtiene todos los usuarios
exports.getAllUsers = factory.getAll(User);

// Actualiza usuario
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use  /updateMyPassword',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email', 'phone', 'address');

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

// Elimina Usuarios
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Busqueda con filtros
exports.getFilter = factory.getFilter(User);

// Obtiene usuario por id
exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getUserByDoc = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  if (!id) {
    res.status(400).json({
      status: 'error',
      message: 'No ingresó documento',
    });
    return;
  }

  const user = await User.find({ document: Number(+id) });

  if (!user) {
    res.status(401).json({
      status: 'success',
      message: 'No se encontró usuario con el documento ' + id,
    });
    return;
  }

  res.status(200).json({
    status: 'success',
    user,
  });
});
