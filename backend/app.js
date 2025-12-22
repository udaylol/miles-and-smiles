import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Routes from './routes/index.js';
import multer from 'multer';
import { sendResponse } from './utils/response.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is running :)');
});

// Routes
app.use('/auth', Routes.auth);
app.use('/user', Routes.user);
app.use('/friend', Routes.friend);

// Error Handling Middlewares
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_COUNT') {
      return sendResponse(res, 400, false, 'Only one file can be uploaded');
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return sendResponse(res, 400, false, 'Unexpected file field');
    }

    return sendResponse(res, 400, false, 'File upload error');
  }

  next(err);
});

app.use((err, req, res, next) => {
  console.error('Uncaught Error:', err);
  return sendResponse(500, false, 'Internal Server Error');
});

export default app;
