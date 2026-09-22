import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../function/sequelize.ts";
import type Doctor from "./Doctor.ts";
import type Patient from "./Patient.ts";
import type Receptionist from "./Receptionist.ts";

class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
    declare id: CreationOptional<number>;
    declare status: string;
    declare start_time: Date;
    declare end_time: Date;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare doctorId: ForeignKey<Doctor['id']>;
    declare patientId: ForeignKey<Patient['id']>;
    declare receptionistId: ForeignKey<Receptionist['id']>;
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Booked",
            comment: "Booked / Cancel"
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "booking date and start time"
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "booking date and end time"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        comment: "To store all booking record",
        tableName: "booking",
        modelName: "booking",
    }
);

export default Booking;