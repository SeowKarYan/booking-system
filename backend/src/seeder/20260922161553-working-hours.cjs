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
        ORDER BY id
        LIMIT 50
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    for (const doctor of doctors) {
      // Randomly choose 4–6 days from Sun - Sat
      const days = faker.helpers.shuffle([0, 1, 2, 3, 4, 5, 6]);

      const numberOfWorkingDays = faker.number.int({
        min: 4,
        max: 6,
      });

      const workingDays = days.slice(0, numberOfWorkingDays);

      for (const day of workingDays) {
        // 9am to 1pm and 2pm to 5pm
        data.push(
          {
            day,
            start_time: "09:00:00.000",
            end_time: "13:00:00.000",
            createdAt: new Date(),
            updatedAt: new Date(),
            doctorId: doctor.id
          },
          {
            day,
            start_time: "14:00:00.000",
            end_time: "17:00:00.000",
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
