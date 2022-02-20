const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const app = require('./app');

// Variables de entorno
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;

const DB = process.env.DATABASE.replace(
  '<DBNAME>',
  process.env.DATABASE_NAME
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log('MongoDB connected!!');
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
