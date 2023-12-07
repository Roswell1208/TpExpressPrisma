import express from 'express';
import bodyParser from 'body-parser';
import { passportMiddleware, requireAuth } from './config/passport-config';
import productsRouter from './routes/productsRoutes';
import usersRouter from './routes/usersRoutes';
import ordersRouter from './routes/ordersRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Middleware Passport
app.use(passportMiddleware);

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/orders', requireAuth, ordersRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
