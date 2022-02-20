const factory = require('./handlerFactory.controller');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment-timezone');
const Company = require('../models/company.model');

// Obtiene ciudad por id
exports.getCompanyById = factory.getOne(Company);

// Obtiene todas las ciudades
exports.getAllCompanies = factory.getAll(Company);

exports.getFilter = factory.getFilter(Company);

// Crea ciudad
exports.createCompany = factory.createOne(Company);

// Actualiza datos de la ciudad
exports.updateCompany = factory.updateOne(Company);

// Borra una ciudad
exports.deleteCompany = factory.deleteOne(Company);
