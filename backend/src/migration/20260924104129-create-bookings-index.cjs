'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
    await queryInterface.removeIndex(
      "booking",
      "unique_booked_booking",
    );

    await queryInterface.removeColumn(
      "booking",
      "booked_unique",
    );
  }
};
