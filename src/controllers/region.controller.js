const factory = require('./handlerFactory.controller');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment-timezone');
const Region = require('../models/region.model');

// Obtiene región por id
exports.getRegionById = factory.getOne(Region);

// Obtiene todas las regiones
exports.getAllRegions = factory.getAll(Region);

// Crea Region
exports.createRegion = factory.createOne(Region);

// Actualiza datos de la region
exports.updateRegion = factory.updateOne(Region);

// Borra una Region
exports.deleteRegion = factory.deleteOne(Region);

exports.getFilter = factory.getFilter(Region);

/* exports.getRegionByDate = catchAsync(async (req, res, next) => {
  const { date } = req.params;

  const startDate = moment(date).tz('America/Bogota').format();
  const endDate = moment(date).add(23, 'hours').tz('America/Bogota').format();

  const Region = await Region.find({ startDate: { $gte: startDate, $lt: endDate } });

  res.status(200).json({
    status: 'success',
    Region,
  });
}); */
