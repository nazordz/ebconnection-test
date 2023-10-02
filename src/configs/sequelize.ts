import { Sequelize } from "sequelize";
import { getEnv } from "./config";

const sequelize = new Sequelize(getEnv('DB_NAME'), getEnv('DB_USER'), getEnv('DB_PASSWORD'), {
    host: getEnv('DB_HOST'),
    dialect: 'mysql',
    // port: 3306,
})

export default sequelize;