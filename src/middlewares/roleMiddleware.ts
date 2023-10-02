import { getEnv } from "@/configs/config";
import User from "@/models/user";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        var token = req.headers["authorization"];
        if (!token) {
            throw new Error("No token provided!");
        }
        token = token.replace("Bearer ", "");
        const decoded = jwt.verify(
            token,
            getEnv('JWT_SECRET_KEY')
        ) as jwt.JwtPayload;
        const loggedUser = decoded["user"] as User;
        const user = await User.findByPk(loggedUser.id);
            
        if (user!.role == Role.Admin) {
            next();
        } else {
            return res.status(401).json({
                message: "not authorized",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            message: "No token provided!",
        });
    }
}


