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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const usersRouter = (0, express_1.Router)();
// Route pour récupérer tous les utilisateurs
usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour créer un nouvel utilisateur
usersRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Validation des données d'entrée
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'Bad Request - Missing required fields' });
        }
        // Validation du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Bad Request - Invalid email format' });
        }
        // Hashage du mot de passe
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash,
            },
        });
        res.json(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour se connecter
usersRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validation des données d'entrée
        if (!email || !password) {
            return res.status(400).json({ error: 'Bad Request - Missing required fields' });
        }
        // Validation du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Bad Request - Invalid email format' });
        }
        // Recherche de l'utilisateur dans la base de données
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        // Si l'utilisateur n'existe pas
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Si l'utilisateur existe, on vérifie le mot de passe
        const validPassword = yield bcrypt_1.default.compare(password, user.passwordHash);
        // Si le mot de passe est invalide
        if (!validPassword) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Si le mot de passe est valide, on génère un token
        const token = jsonwebtoken_1.default.sign({
            sub: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        // On envoie le token dans le header
        res.header('Authorization', `Bearer ${token}`);
        // On renvoie également l'utilisateur sans le mot de passe
        const { passwordHash } = user, userWithoutPassword = __rest(user, ["passwordHash"]);
        res.json(userWithoutPassword);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour modifier le nom et le prénom d'un utilisateur
usersRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName } = req.body;
        const updatedUser = yield prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                firstName,
                lastName,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Route pour supprimer un utilisateur
usersRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.user.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = usersRouter;
