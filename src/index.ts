import express from 'express';
import bodyParser from 'body-parser';
import { passportMiddleware, requireAuth } from './middlewares/authMiddleware';
import productsRouter from './routes/productsRoutes';
import usersRouter from './routes/usersRoutes';
import ordersRouter from './routes/ordersRoutes';
import helmet from 'helmet';
import cors from 'cors';
import ejs from 'ejs';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

// Middleware pour sécuriser l'application
app.use(helmet());

// Middleware pour autoriser les requêtes depuis n'importe quelle origine
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Middleware Passport
app.use(passportMiddleware);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/productsList', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.render('products', { products }); // Passe la liste des produits à la vue
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/ordersList', async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.render('order', { orders }); // Passe la liste des commandes à la vue
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/orders', requireAuth, ordersRouter);

app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
