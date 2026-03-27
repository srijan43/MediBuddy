const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDb } = require('./config/db');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const meRoutes = require('./routes/me.routes');
const doctorRoutes = require('./routes/doctors.routes');
const recommendationRoutes = require('./routes/recommendations.routes');
const appointmentRoutes = require('./routes/appointments.routes');

const app = express();

app.use(express.json({ limit: '1mb' }));

const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: corsOrigin?.length ? corsOrigin : true,
    credentials: true,
  })
);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`API listening on ${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

