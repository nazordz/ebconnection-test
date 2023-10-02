import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import sequelize from "../configs/sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare username: string;
    declare email: string;
    declare phone: string;
    declare password: string;
    declare company: string;
    declare role: Role;
}

User.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        email: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING,
        },
        phone: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        company: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        role: {
            allowNull: false,
            type: DataTypes.ENUM,
            values: ['admin', 'helpdesk', 'operator'],
        },
    },
    {
        defaultScope: {
            attributes: { exclude: ["password"] },
        },
        scopes: {
            withPassword: {
                attributes: { include: ["password"] },
            },
        },
        sequelize: sequelize,
        tableName: "users",
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default User;
