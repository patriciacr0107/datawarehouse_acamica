const factory = require('./handlerFactory.controller');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment-timezone');
const City = require('../models/city.model');

// Obtiene ciudad por id
exports.getCityById = factory.getOne(City);

// Obtiene todas las ciudades
exports.getAllCities = factory.getAll(City);

// Crea ciudad
exports.createCity = factory.createOne(City);

// Actualiza datos de la ciudad
exports.updateCity = factory.updateOne(City);

// Borra una ciudad
exports.deleteCity = factory.deleteOne(City);

exports.deleteMany = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let body = {
        country: id,
    };

    const doc = await City.remove(body);

    if (!doc) {
        return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: null,
    });
});