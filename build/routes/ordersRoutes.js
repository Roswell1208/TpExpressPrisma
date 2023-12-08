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
const ordersRouter = (0, express_1.Router)();
// Route pour récupérer toutes les commandes
ordersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany();
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour créer une nouvelle commande
ordersRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId, quantity } = req.body;
    try {
        const newOrder = yield prisma.order.create({
            data: {
                user: { connect: { id: userId } },
                product: { connect: { id: productId } },
                quantity,
            },
        });
        res.json(newOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour modifier la quantité d'un produit dans une commande
ordersRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const updatedOrder = yield prisma.order.update({
            where: {
                id: parseInt(id),
            },
            data: {
                quantity,
            },
        });
        res.json(updatedOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour annuler une commande
ordersRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const canceledOrder = yield prisma.order.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.json(canceledOrder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = ordersRouter;
