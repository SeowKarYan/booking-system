import { sequelize } from "./sequelize.ts";

export const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export const disconnectDatabase = async () => {
    try {
        await sequelize.close()
        console.log('Database disconnected successfully.');
    } catch (error) {
        console.error('Unable to disconnect the database:', error);
    }
}
