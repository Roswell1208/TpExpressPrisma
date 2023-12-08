import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      if (payload.sub) {
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } else {
        console.log('No sub found', payload);
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export const passportMiddleware = passport.initialize();
export const requireAuth = passport.authenticate('jwt', { session: false });
