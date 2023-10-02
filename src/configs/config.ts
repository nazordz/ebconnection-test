import dotenv from 'dotenv';
dotenv.config();

export function getEnv(key: string) {
    try {
        const value = process.env[key];
        if (!value) {
            throw new Error(`${key} hasn't declared`);
        }
        return value;
    } catch (error) {
        console.log(error);
        throw new Error(`${key} hasn't declared`)
    }
}