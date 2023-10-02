import User from "@/models/user";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

export async function createUser(req: Request<{}, {}, CreateUserRequest>, res: Response) {
    try {
        const isValid = validationResult(req);
        if (!isValid.isEmpty()) {
            isValid.throw();
        }
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            company: req.body.company,
            password: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            role: req.body.role
        })
        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(422).json({
            message: error
        })
    }
}

export async function listUser(req: Request, res: Response) {
    const users = await User.findAll();
    return res.json(users);
}