'use strict';
const { faker } = require('@faker-js/faker');
const { addWeeks, addDays, format, startOfWeek, addMinutes } = require('date-fns');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = []

    let availableslot = [
      { hour: 9, minute: 0 },
      { hour: 9, minute: 30 },
      { hour: 10, minute: 0 },
      { hour: 10, minute: 30 },
      { hour: 11, minute: 0 },
      { hour: 11, minute: 30 },
      { hour: 12, minute: 0 },
      { hour: 12, minute: 30 },
      { hour: 14, minute: 0 },
      { hour: 14, minute: 30 },
      { hour: 15, minute: 0 },
      { hour: 15, minute: 30 },
      { hour: 16, minute: 0 },
      { hour: 16, minute: 30 },
    ]

    const patients = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM patient
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    const doctors = await queryInterface.sequelize.query(
      `
        SELECT id, consultation_period
        FROM doctor
        ORDER BY id
        LIMIT 50
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    const workingHours = await queryInterface.sequelize.query(
      `
        SELECT doctorId, day
        FROM working_hour
        GROUP BY day, doctorId
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    const leaves = await queryInterface.sequelize.query(
      `
        SELECT doctorId, start_time, end_time
        FROM doctor_leave
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    // 5000 booking for 12 months, each doctor have 1 - 2 booking within a week
    for (const doctor of doctors) {
      let doctorWorkingDays = workingHours.filter(wh => wh.doctorId === doctor.id).map(wh => wh.day)
      let doctorLeaves = leaves.filter(leave => leave.doctorId === doctor.id).map(leave => format(new Date(leave.end_time), 'yyyy-MM-dd'))
      let consultationDuration = doctor.consultation_period

      for (let i = 0; i < 52; i++) {
        let firstBookingDay = faker.helpers.arrayElement(doctorWorkingDays);
        let secondBookingDay = faker.helpers.arrayElement(doctorWorkingDays.filter(day => day !== firstBookingDay));

        let firstBookingTimeslot = faker.helpers.arrayElement(availableslot)
        let secondBookingTImeslot = faker.helpers.arrayElement(availableslot)

        const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 })

        let firstBookingDate = addDays(addWeeks(weekStart, i), firstBookingDay)
        let secondBookingDate = addDays(addWeeks(weekStart, i), secondBookingDay)

        let firstBookingDateTime = new Date(new Date(firstBookingDate).setHours(firstBookingTimeslot.hour, firstBookingTimeslot.minute))
        let secondBookingDateTime = new Date(new Date(secondBookingDate).setHours(secondBookingTImeslot.hour, secondBookingTImeslot.minute))

        if (!doctorLeaves.includes(format(firstBookingDateTime, 'yyyy-MM-dd'))) {
          let patient = faker.helpers.arrayElement(patients)
          data.push({
            status: "Booked",
            start_time: firstBookingDateTime,
            end_time: addMinutes(firstBookingDateTime, consultationDuration),
            createdAt: new Date(),
            updatedAt: new Date(),
            doctorId: doctor.id,
            patientId: patient.id
          })
        }

        if (!doctorLeaves.includes(format(secondBookingDateTime, 'yyyy-MM-dd'))) {
          let patient = faker.helpers.arrayElement(patients)
          data.push({
            status: "Booked",
            start_time: secondBookingDateTime,
            end_time: addMinutes(secondBookingDateTime, consultationDuration),
            createdAt: new Date(),
            updatedAt: new Date(),
            doctorId: doctor.id,
            patientId: patient.id
          })
        }

        if (data.length >= 1000) {
          await queryInterface.bulkInsert('booking', data, {});
          data = []
        }
      }
    }

    if (data.length > 0) {
      await queryInterface.bulkInsert('booking', data, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('booking', null, {});
  }
};
