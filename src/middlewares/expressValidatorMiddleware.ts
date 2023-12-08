import express from 'express';
import { validationResult } from 'express-validator';

// Middleware pour gérer les erreurs de validation Express
export const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};