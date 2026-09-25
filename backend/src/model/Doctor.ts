import type { InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../function/sequelize.ts";
import type WorkingHour from "./WorkingHour.ts";
import type Booking from "./Booking.ts";
import type DoctorLeave from "./DoctorLeave.ts";

class Doctor extends Model<InferAttributes<Doctor>, InferCreationAttributes<Doctor>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;
    declare consultation_period: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare working_hours?: NonAttribute<WorkingHour[]>;
    declare bookings?: NonAttribute<Booking[]>;
    declare doctor_leaves?: NonAttribute<DoctorLeave[]>;
}

Doctor.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "name"
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: "email for login"
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "password for login"
        },
        consultation_period: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 60,
            comment: "consultation period in minutes, default 60 min"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        comment: "To store all doctor account",
        tableName: "doctor",
        modelName: "doctor",
    }
);

export default Doctor;