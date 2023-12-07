"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_config_1 = require("./config/passport-config");
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const ordersRoutes_1 = __importDefault(require("./routes/ordersRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware pour parser le corps des requêtes en JSON
app.use(body_parser_1.default.json());
// Middleware Passport
app.use(passport_config_1.passportMiddleware);
app.use('/products', productsRoutes_1.default);
app.use('/users', usersRoutes_1.default);
app.use('/orders', passport_config_1.requireAuth, ordersRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
