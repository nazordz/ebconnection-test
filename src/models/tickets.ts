import sequelize from "@/configs/sequelize";
import { CreationOptional, DataTypes, HasOneGetAssociationMixin, HasOneSetAssociationMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import WorkOrder from "./workOrder";

export enum TicketStatus {
    Open = "OPEN",
    OnProgress = "ON_PROGRESS",
    Submitted = "SUBMITTED",
    Done = "DONE"
}

class Ticket extends Model<InferAttributes<Ticket, {omit: 'ticket'}>, InferCreationAttributes<Ticket, {omit: 'ticket'}>> {
    declare id: CreationOptional<string>;
    declare issue: string;
    declare key: string;
    declare status: TicketStatus;
    declare doneAt: CreationOptional<string>;
    declare doneBy: CreationOptional<string>;
    declare createdBy: string;
    declare ticket: HasOneGetAssociationMixin<Ticket>;
    declare setWorkOrder: HasOneSetAssociationMixin<Ticket, string>;
    declare workOrder?: NonAttribute<WorkOrder>;
}


Ticket.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    issue: {
        allowNull: false,
        type: DataTypes.STRING
    },
    key: {
        allowNull: false,
        type: DataTypes.STRING
    },
    status: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: [
            "OPEN",
            "ON_PROGRESS",
            "SUBMITTED",
            "DONE"
        ]
    },
    createdBy: {
        allowNull: false,
        type: DataTypes.STRING
    },
    doneBy: {
        type: DataTypes.STRING
    },
    doneAt: {
        type: 'datetime'
    }
}, {
    sequelize: sequelize, 
    tableName: 'tickets',
    underscored: true
})

Ticket.hasOne(WorkOrder, {
    sourceKey: 'id',
    foreignKey: 'ticket_id',
    // as: 'work_order'
})
WorkOrder.belongsTo(Ticket, {
    targetKey: 'id',
    // as: 'ticket'
})

export default Ticket;