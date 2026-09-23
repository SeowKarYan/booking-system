import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../function/sequelize.ts";
import type Doctor from "./Doctor.ts";

class DoctorLeave extends Model<InferAttributes<DoctorLeave>, InferCreationAttributes<DoctorLeave>> {
    declare id: CreationOptional<number>;
    declare start_time: Date;
    declare end_time: Date;
    declare type: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare doctorId: ForeignKey<Doctor['id']>;
}

DoctorLeave.init(
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
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "AL",
            comment: "AL / EL"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        comment: "To store all doctor leave",
        tableName: "doctor_leave",
        modelName: "doctor_leave",
    }
);

export default DoctorLeave;