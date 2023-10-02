import { Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getCurrentUser } from "@/helpers";
import { getEnv } from "@/configs/config";

export async function generateJwtToken(userId: string) {
    var bodyUser = await User.findByPk(userId);
    const expiresIn = 1 * 60 * 60; // 1 jam
    const expiresRefresh = expiresIn * 7; // 7 hari
    const bearerToken = jwt.sign({
        user: bodyUser!.toJSON()
    }, getEnv('JWT_SECRET_KEY'), {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn
    });
    const refreshToken = jwt.sign({id: bodyUser?.id}!, getEnv('JWT_SECRET_KEY'), {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: expiresRefresh
    });
    return {
        bearerToken,
        refreshToken,
        expiresIn
    }
}

export async function authLogin(req: Request<{}, {}, LoginRequest>, res: Response) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            result.throw();
        }
        const user = await User.scope('withPassword').findOne({
            where: {username: req.body.username}
        });
        if (user) {
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                throw new Error("password not match");
            }
            const { bearerToken, refreshToken, expiresIn } = await generateJwtToken(user.id);

            const response: LoginResponse = {
                bearer_token: bearerToken,
                refresh_token: refreshToken,
                expires_in: expiresIn,
                token_type: 'Bearer',
            }
            return res.json(response);
        } else {
            throw new Error("user not found");
        }
    } catch (error) {
        console.error(error);
        res.status(422).json({
            message: error
        })
    }
}

export async function currentUser(req: Request, res: Response) {
    const decoded = getCurrentUser(req);
    return res.json(decoded);
}

export async function refreshToken(req: Request<{}, {}, RefreshTokenRequest>, res: Response) {
    jwt.verify(req.body.refresh_token, getEnv('JWT_SECRET_KEY'), async (err, decoded) => {
        try {
            if (err) {
                throw new Error("refresh token invalid")
            }
            var data = decoded as jwt.JwtPayload;
            const loggedUser = data['user'] as User | undefined;
            if (loggedUser == undefined) {
                throw new Error("refresh token invalid")
            }
            const { bearerToken, refreshToken, expiresIn } = await generateJwtToken(loggedUser.id);
            return res.json({
                bearer_token: bearerToken,
                refresh_token: refreshToken,
                expires_in: expiresIn,
                token_type: 'Bearer',
            })

        } catch (error) {
            return res.status(401).json({
                message: error
            })
        }
    });
}