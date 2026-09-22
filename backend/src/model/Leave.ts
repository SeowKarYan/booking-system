import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../function/sequelize.ts";
import type Doctor from "./Doctor.ts";

class Leave extends Model<InferAttributes<Leave>, InferCreationAttributes<Leave>> {
    declare id: CreationOptional<number>;
    declare start_time: Date;
    declare end_time: Date;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare doctorId: ForeignKey<Doctor['id']>;
}

Leave.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "starting date and time"
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "ending date and time"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        comment: "To store all doctor leave",
        tableName: "leave",
        modelName: "leave",
    }
);

export default Leave;