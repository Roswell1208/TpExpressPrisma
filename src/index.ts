import express from 'express';
import bodyParser from 'body-parser';
import { passportMiddleware, requireAuth } from './middlewares/authMiddleware';
import productsRouter from './routes/productsRoutes';
import usersRouter from './routes/usersRoutes';
import ordersRouter from './routes/ordersRoutes';
import helmet from 'helmet';
import cors from 'cors';
import { body } from 'express-validator';
import { handleValidationErrors } from './middlewares/expressValidatorMiddleware';

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour sécuriser l'application
app.use(helmet());

// Middleware pour autoriser les requêtes depuis n'importe quelle origine
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Middleware Passport
app.use(passportMiddleware);

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/orders', requireAuth, body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 5 }), handleValidationErrors, ordersRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
