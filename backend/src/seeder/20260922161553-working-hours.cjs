'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = []

    const doctors = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM doctor
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    let working_shift = [
      { start_time: "00:00:00.000", end_time: "08:00:00.000" },
      { start_time: "08:00:00.000", end_time: "16:00:00.000" },
      { start_time: "16:00:00.000", end_time: "00:00:00.000" },
    ]

    for (const doctor of doctors) {
      const days = faker.helpers.shuffle([0, 1, 2, 3, 4, 5, 6]);

      const numberOfWorkingDays = faker.number.int({
        min: 5,
        max: 6,
      });

      const workingDays = days.slice(0, numberOfWorkingDays);

      for (const day of workingDays) {
        let selectedShift = faker.helpers.arrayElement(working_shift)
        data.push(
          {
            day,
            start_time: selectedShift.start_time,
            end_time: selectedShift.end_time,
            createdAt: new Date(),
            updatedAt: new Date(),
            doctorId: doctor.id
          }
        )
      }
    }

    if (data.length >= 0) {
      await queryInterface.bulkInsert('working_hour', data, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('working_hour', null, {});
  }
};
