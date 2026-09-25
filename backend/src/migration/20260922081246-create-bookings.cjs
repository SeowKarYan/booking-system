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

    await queryInterface.sequelize.query(`
      ALTER TABLE booking
      ADD COLUMN booked_unique BOOLEAN
      GENERATED ALWAYS AS (
        CASE
          WHEN status = 'Booked' THEN TRUE
          ELSE NULL
        END
      ) STORED
    `);

    await queryInterface.addIndex(
      "booking",
      ["doctorId", "start_time", "booked_unique"],
      {
        name: "unique_booked_booking",
        unique: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('booking');
  }
};
