import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import { connectDB, disconnectDB } from './config/db.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [...process.env.ALLOWED_ORIGINS?.split(',')];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

connectDB();

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed successfully');
    disconnectDB();
  });
});
