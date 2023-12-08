import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/expressValidatorMiddleware';
import roleMiddleware from '../middlewares/roleMiddleware';

const prisma = new PrismaClient();

const usersRouter = Router();

const requireAdmin = roleMiddleware('admin');

// Route pour récupérer tous les utilisateurs
usersRouter.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour créer un nouvel utilisateur
usersRouter.post(
  '/signup',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 5 }),
  handleValidationErrors,
  async (req, res) => {
  try {
    const { firstName, lastName, email, password, role }: {firstName: string, lastName: string, email: string, password: string, role: string} = req.body;

    // Validation des données d'entrée
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Bad Request - Missing required fields' });
    }

    // Hashage du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role,
      },
    });
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour se connecter
usersRouter.post(
  '/login', 
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 5 }),
  handleValidationErrors,
  async (req, res) => {
  try {
    const { email, password }: {email: string, password: string} = req.body;

    // Validation des données d'entrée
    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request - Missing required fields' });
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Si l'utilisateur n'existe pas
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Si l'utilisateur existe, on vérifie le mot de passe
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    // Si le mot de passe est invalide
    if (!validPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Si le mot de passe est valide, on génère un token
    const token = jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );

    console.log(token);

    // On envoie le token dans le header
    res.header('Authorization', `Bearer ${token}`);

    // On renvoie également l'utilisateur sans le mot de passe
    const { passwordHash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour modifier le nom et le prénom d'un utilisateur
usersRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName }: {firstName: string, lastName: string} = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        firstName,
        lastName,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour supprimer un utilisateur
usersRouter.delete(
  '/:id', 
  requireAdmin,
  async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default usersRouter;