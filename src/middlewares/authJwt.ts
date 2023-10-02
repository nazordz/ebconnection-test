import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "@/configs/config";

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
    try {
        var token = req.headers['authorization'];
        if (!token) {
            throw new Error('No token provided!');
        }
        token = token.replace("Bearer ", "");
        jwt.verify(token, getEnv('JWT_SECRET_KEY'), (err, decoded) => {
            if (err) {
                return res.status(403).json(err);
            }
            // @ts-ignore
            req.user = decoded.user;
            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(403).json({
            message: 'No token provided!'
        });
    }
}