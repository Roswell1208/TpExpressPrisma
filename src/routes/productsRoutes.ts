import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productsRouter = Router();

// Route pour récupérer tous les produits
productsRouter.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour créer un nouveau produit
productsRouter.post('/', async (req, res) => {
  const { name, description, price }: {name: string, description: string, price: number} = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
      },
    });
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour modifier le nom et la description d'un produit
productsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price }: {name: string, description: string, price: number} = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        description,
        price,
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour supprimer un produit
productsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).json(deletedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default productsRouter;