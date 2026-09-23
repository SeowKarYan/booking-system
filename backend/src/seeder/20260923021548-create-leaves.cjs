'use strict';
const { faker } = require('@faker-js/faker');
const { startOfWeek, addWeeks } = require('date-fns');

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
      const workingHours = await queryInterface.sequelize.query(
        `
        SELECT day
        FROM working_hour
        WHERE doctorId = :doctorId
        GROUP BY day
      `,
        {
          replacements: { doctorId: doctor.id },
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      );

      // random choose 1 day as annual leave
      const doctorLeaveDay = faker.helpers.arrayElement(workingHours);

      const result = startOfWeek(new Date(), { weekStartsOn: doctorLeaveDay.day })

      const randomWeek = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8])

      let doctorLeaveDate = addWeeks(result, randomWeek)

      data.push({
        start_time: new Date(new Date(doctorLeaveDate).setHours(0, 0, 0, 0)),
        end_time: new Date(new Date(doctorLeaveDate).setHours(23, 59, 59, 999)),
        type: "AL",
        createdAt: new Date(),
        updatedAt: new Date(),
        doctorId: doctor.id,
      })
    }

    if (data.length > 0) {
      await queryInterface.bulkInsert('doctor_leave', data, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctor_leave', null, {});
  }
};
