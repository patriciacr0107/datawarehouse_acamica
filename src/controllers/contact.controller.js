const factory = require('./handlerFactory.controller');
const Contact = require('../models/contact.model');
const catchAsync = require('../utils/catchAsync');

// Obtiene contacto por id
exports.getContactById = factory.getOne(Contact);

// Obtiene todos los contactos
exports.getAllContacts = factory.getAll(Contact);

// Crea contacto
exports.createContact = factory.createOne(Contact);

// Actualiza datos de la contacto
exports.updateContact = factory.updateOne(Contact);

// Borra una contacto
exports.deleteContact = factory.deleteOne(Contact);

// Borrar varios contactos
exports.deleteContacts = catchAsync(async (req, res, next) => {
  for (let contact of req.body) {
    // console.log('body', contact);
    const doc = await Contact.findByIdAndDelete(contact);

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
