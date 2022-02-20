const factory = require('./handlerFactory.controller');
const Country = require('../models/country.model');
const catchAsync = require('../utils/catchAsync');


// Obtiene pais por id
exports.getCountryById = factory.getOne(Country);

// Obtiene todas las paises
exports.getAllCountries = factory.getAll(Country);

// Crea pais
exports.createCountry = factory.createOne(Country);

// Actualiza datos de la pais
exports.updateCountry = factory.updateOne(Country);

// Borra una pais
exports.deleteCountry = factory.deleteOne(Country);

exports.deleteMany = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let body = {
        region: id,
    };

    const doc = await Country.remove(body);

    if (!doc) {
        return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: null,
    });
});