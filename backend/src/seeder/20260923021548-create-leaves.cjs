'use strict';
const { faker } = require('@faker-js/faker');
const { startOfWeek, addWeeks, setHours, addHours, addDays } = require('date-fns');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = []

    const doctors = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM doctor
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    for (const doctor of doctors) {
      const workingHours = await queryInterface.sequelize.query(
        `
        SELECT day, start_time
        FROM working_hour
        WHERE doctorId = :doctorId
      `,
        {
          replacements: { doctorId: doctor.id },
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      );

      // random choose 1 hour to block
      const doctorLeaveDay = faker.helpers.arrayElement(workingHours);

      const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 })
      const weekDay = addDays(weekStart, doctorLeaveDay.day)

      const randomWeek = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])

      let doctorLeaveDate = addWeeks(weekDay, randomWeek)

      let hour = doctorLeaveDay.start_time.split(":")[0]
      let doctorLeaveStart = setHours(doctorLeaveDate, hour)
      let doctorLeaveEnd = addHours(doctorLeaveStart, 1)

      data.push({
        start_time: doctorLeaveStart,
        end_time: doctorLeaveEnd,
        type: "Meeting",
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
