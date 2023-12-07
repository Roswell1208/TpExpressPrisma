"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const productsRouter = (0, express_1.Router)();
// Route pour récupérer tous les produits
productsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany();
        res.json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour créer un nouveau produit
productsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price } = req.body;
    try {
        const newProduct = yield prisma.product.create({
            data: {
                name,
                description,
                price,
            },
        });
        res.json(newProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour modifier le nom et la description d'un produit
productsRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedProduct = yield prisma.product.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                description,
            },
        });
        res.json(updatedProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour supprimer un produit
productsRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedProduct = yield prisma.product.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.json(deletedProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = productsRouter;
