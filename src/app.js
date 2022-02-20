const express = require('express');
const app = express();
const moment = require('moment-timezone');
const morgan = require('morgan');
const compression = require('compression');
const AppError = require('./utils/appError');
const dotenv = require('dotenv');
const globalErrorHandler = require('./controllers/errorController');
/* const {
  userRouter,
  regionRouter,
  cityRouter,
  countryRouter,
} = require('./routes'); */
const cors = require('cors');
dotenv.config({ path: './config/config.env' });

const userRouter = require('./routes/user.routes');
const regionRouter = require('./routes/region.routes');
const cityRouter = require('./routes/city.routes');
const countryRouter = require('./routes/country.routes');
const companyRouter = require('./routes/company.routes');
const contactRouter = require('./routes/contact.routes');
const chanelRouter = require('./routes/chanel.routes');

// 1 MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Implementación CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Content-Type, Authorization, X-Requested-With'
  );

  next();
});

/* app.use(cors()); */

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Bodyparser para obtener el body del método
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cookieParser());

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());
app.use(express.static(`${__dirname}/public`));
app.use(compression());
app.use((req, res, next) => {
  req.requestTime = moment().tz('America/Bogota').format();
  next();
});

// ROUTES
/* app.get('/', (req, res) => {
  res.status(200).json({
    app: 'Data Warehouse Backend API',
    message: 'Servicio iniciado...',
  });
}); */

app.use('/api/users', userRouter);
app.use('/api/regions', regionRouter);
app.use('/api/cities', cityRouter);
app.use('/api/countries', countryRouter);
app.use('/api/companies', companyRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/chanels', chanelRouter);

app.all('*', (req, res, next) => {
  /* const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404; */

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
