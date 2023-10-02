import sequelize from "@/configs/sequelize";
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import Ticket from "./tickets";

export enum WorkOrderStatus {
    Open = "OPEN",
    OnProgress = "ON_PROGRESS",
    Done = "DONE"
}

class WorkOrder extends Model<InferAttributes<WorkOrder>, InferCreationAttributes<WorkOrder>> {
    declare id: CreationOptional<string>;
    declare ticketId: ForeignKey<Ticket['id']>;
    declare ticket?: NonAttribute<Ticket>
    declare status: WorkOrderStatus;
    declare doneAt: CreationOptional<string>;
    declare doneBy: CreationOptional<string>;
    declare createdBy: ForeignKey<string>;
}

WorkOrder.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    ticketId: {
        type: DataTypes.STRING,
        references: {
            model: Ticket,
            key: 'ticket_id'
        }
    },
    status: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: [
            "OPEN",
            "ON_PROGRESS",
            "DONE"
        ]
    },
    doneAt: {
        type: 'datetime'

    },
    doneBy: {
        type: DataTypes.STRING

    },
    createdBy: {
        allowNull: false,
        type: DataTypes.STRING
    },
}, {
    sequelize: sequelize,
    tableName: 'work_orders',
    underscored: true
})



export default WorkOrder
