const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
var ObjectId = require('mongodb').ObjectId;

const filterObj = (obj, ...allowedFields) => {
  console.log('allowedFields', allowedFields);
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError(`Password can't be modify`, 404));
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      doc,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: doc.length,
      doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      doc,
    });
  });

exports.getFilter = (Model) =>
  catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const sort = req.query?.sort?.split(',')?.join(' ');
    const skip = (page - 1) * limit;
    const busqueda = req.query.name;
    const regex = new RegExp(busqueda, 'i');
    const query = { name: regex };

    console.log({ busqueda, query });

    const doc = await Model.find(query).skip(skip).limit(limit).sort(sort);

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: doc.length,
      doc,
    });
  });
