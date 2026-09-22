'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Booked",
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      doctorId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'doctor',
          key: 'id',
        },
        allowNull: false,
      },
      patientId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'patient',
          key: 'id',
        },
        allowNull: false,
      },
      receptionistId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'receptionist',
          key: 'id',
        },
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking');
  }
};
