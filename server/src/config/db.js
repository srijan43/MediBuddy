const mongoose = require('mongoose');

async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw Object.assign(new Error('Missing MONGO_URI'), { statusCode: 500 });
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== 'production',
  });

  console.log('MongoDB connected');
}

module.exports = { connectDb };

