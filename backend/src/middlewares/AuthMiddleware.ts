import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class AuthMiddleware {
  async validateToken(req: Request, res: Response, next: NextFunction) {
    const secret_key = process.env.JWT_SECRET as string;
    const { authtoken } = req.body;
    
    if (!authtoken) {
       return res.status(401).json({ msg: "No token provided" });
    }

    try {
      const decoded = jwt.verify(authtoken, secret_key);
      (req as any).user = decoded; 
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Not A Valid Auth" });
    }
  }

  async validateAuthEndpoint(req: Request, res: Response) {
    const secret_key = process.env.JWT_SECRET as string;
    const { authtoken } = req.body; 
    
    try {
        jwt.verify(authtoken, secret_key);
        res.status(200).json({ msg: "Valid Auth" });
    } catch(err) {
        res.status(404).json({ msg: "Not A Valid Auth" });
    }
  }
}

export default new AuthMiddleware();
