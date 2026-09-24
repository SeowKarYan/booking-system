import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../function/sequelize.ts";
import type Doctor from "./Doctor.ts";

class WorkingHour extends Model<InferAttributes<WorkingHour>, InferCreationAttributes<WorkingHour>> {
    declare id: CreationOptional<number>;
    declare day: number;
    declare start_time: string;
    declare end_time: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare doctorId: ForeignKey<Doctor['id']>;
}

WorkingHour.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        day: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "0 - sunday, 6 - saturday"
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
            comment: "starting time"
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
            comment: "ending time"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        comment: "To store all doctor working hour",
        tableName: "working_hour",
        modelName: "working_hour",
    }
);

export default WorkingHour;