"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const ordersRoutes_1 = __importDefault(require("./routes/ordersRoutes"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_validator_1 = require("express-validator");
const expressValidatorMiddleware_1 = require("./middlewares/expressValidatorMiddleware");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware pour sécuriser l'application
app.use((0, helmet_1.default)());
// Middleware pour autoriser les requêtes depuis n'importe quelle origine
app.use((0, cors_1.default)());
// Middleware pour parser le corps des requêtes en JSON
app.use(body_parser_1.default.json());
// Middleware Passport
app.use(authMiddleware_1.passportMiddleware);
app.use('/products', productsRoutes_1.default);
app.use('/users', usersRoutes_1.default);
app.use('/orders', authMiddleware_1.requireAuth, (0, express_validator_1.body)('email').isEmail().normalizeEmail(), (0, express_validator_1.body)('password').isLength({ min: 5 }), expressValidatorMiddleware_1.handleValidationErrors, ordersRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
