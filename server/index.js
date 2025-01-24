import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

const allowedOrigins = [...process.env.ALLOWED_ORIGINS?.split(',')];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed successfully');
    mongoose.disconnect();
  });
});
