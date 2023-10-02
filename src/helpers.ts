import dotenv from "dotenv"
import { Request } from "express";
import jwt from "jsonwebtoken";
import User from "./models/user";
import { getEnv } from "./configs/config";

export function getCurrentUser(req: Request) {
    var token = req.headers['authorization'];
    if (!token) {
        throw new Error('No token provided!');
    }
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, getEnv('JWT_SECRET_KEY')) as jwt.JwtPayload
    const user = decoded['user'] as User;
    return user;
}

export async function isEmailNotInUse(value: string) {
    const user = await User.findOne({where: {
        email: value
    }})
    if (user) {
        throw new Error("Email already in use");
    }
}
