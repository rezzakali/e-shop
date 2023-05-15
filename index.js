// external import
import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

// internal import
import path from 'path';
import connectDb from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import productRoutes from './routes/productRoutes.js';
import {fileURLToPath} from 'url';

// config dotenv
dotenv.config();

// esmodule file
const __filename=fileURLToPath(import.meta.url);
const __direname=path.dirname(__filename);

// enable colors
colors.enable();

// db connection
connectDb();

// port
const PORT = process.env.PORT || 9000;
// host
const HOST_NAME = process.env.HOST_NAME || '127.0.0.1';

// app object
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, './client/dist')));

// route
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/orders', ordersRoutes);

app.use('*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

// error handler || mongodb related
app.use(errorHandler);

// common error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next();
  } else {
    return res.status(500).json({
      success: false,
      error: err?.message,
    });
  }
});

// listening server
app.listen(PORT, HOST_NAME, () => {
  console.log(
    `Your server is running successfully at http://${HOST_NAME}:${PORT}`
      .bgMagenta
  );
});
