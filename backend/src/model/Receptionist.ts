import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../function/sequelize.ts";

class Receptionist extends Model<InferAttributes<Receptionist>, InferCreationAttributes<Receptionist>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Receptionist.init(
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
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        comment: "To store all receptionist account",
        tableName: "receptionist",
        modelName: "receptionist",
    }
);

export default Receptionist;