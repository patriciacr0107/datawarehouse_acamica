const factory = require('./handlerFactory.controller');
const Chanel = require('../models/city.model');

// Obtiene ciudad por id
exports.getChanelById = factory.getOne(Chanel);

// Obtiene todas las ciudades
exports.getAllChanels = factory.getAll(Chanel);

// Crea ciudad
exports.createChanel = factory.createOne(Chanel);

// Actualiza datos de la ciudad
exports.updateChanel = factory.updateOne(Chanel);

// Borra una ciudad
exports.deleteChanel = factory.deleteOne(Chanel);
