require('dotenv').config();
const mongoose = require('mongoose');

const dbOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connectDB = async () => {
  try {
    const x = await mongoose.connect(process.env.MONGODB_URI, dbOptions);
    console.log('Connected to Mongo DB', x.connections[0].name);
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;