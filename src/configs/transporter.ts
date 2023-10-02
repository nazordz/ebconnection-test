import nodemailer from "nodemailer";
import { getEnv } from "./config";

export default nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: getEnv('GMAIL_USER'),
        pass: getEnv('GMAIL_PASSWORD')

    }
})