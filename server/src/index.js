import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import { connectDB, disconnectDB } from './config/db.js';
import userRoutes from './routes/user.routes.js';
import contactRoutes from './routes/contact.routes.js';
import groupRoutes from './routes/group.routes.js';
import messageRoutes from './routes/message.routes.js';
import {
  AUTH_ROUTE,
  CONTACT_ROUTE,
  GROUP_ROUTE,
  MESSAGE_ROUTE,
  USER_ROUTE,
} from './config/apiPaths.js';

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

app.use(AUTH_ROUTE, authRoutes);
app.use(USER_ROUTE, userRoutes);
app.use(CONTACT_ROUTE, contactRoutes);
app.use(GROUP_ROUTE, groupRoutes);
app.use(MESSAGE_ROUTE, messageRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

await connectDB();

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed successfully');
    disconnectDB();
  });
});
