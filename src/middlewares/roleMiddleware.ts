import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const roleMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenParts = authorizationHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid Authorization header format' });
    }

    const token = tokenParts[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {role: string};

      if (decodedToken.role === role) {
        next();
      } else {

        console.log(decodedToken.role);
        console.log(role);
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};

export default roleMiddleware;
