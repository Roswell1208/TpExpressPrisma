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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.passportMiddleware = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload.sub) {
            const user = yield prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }
        else {
            console.log('No sub found', payload);
            return done(null, false);
        }
    }
    catch (error) {
        return done(error, false);
    }
})));
exports.passportMiddleware = passport_1.default.initialize();
exports.requireAuth = passport_1.default.authenticate('jwt', { session: false });
