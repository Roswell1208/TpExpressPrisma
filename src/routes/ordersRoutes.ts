import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ordersRouter = Router();

// Route pour récupérer toutes les commandes
ordersRouter.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour créer une nouvelle commande
ordersRouter.post('/', async (req, res) => {
  const { userId, productId, quantity }: {userId: number, productId: number, quantity: number} = req.body;
  try {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        productId,
        quantity
      },
    });
    res.json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour modifier la quantité d'un produit dans une commande
ordersRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity }: {quantity: number} = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: parseInt(id),
      },
      data: {
        quantity,
      },
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour annuler une commande
ordersRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const canceledOrder = await prisma.order.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).json(canceledOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default ordersRouter;