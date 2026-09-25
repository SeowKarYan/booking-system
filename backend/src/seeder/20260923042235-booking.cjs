'use strict';
const { faker } = require('@faker-js/faker');
const { addWeeks, addDays, startOfWeek, addMinutes, setMinutes, setHours } = require('date-fns');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = []

    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }

    const patients = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM patient
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    const doctors = await queryInterface.sequelize.query(
      `
        SELECT id, consultation_period
        FROM doctor
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    const workingHours = await queryInterface.sequelize.query(
      `
        SELECT doctorId, day, start_time, end_time
        FROM working_hour
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    const leaves = await queryInterface.sequelize.query(
      `
        SELECT doctorId, start_time, end_time
        FROM doctor_leave
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    // 20 doctors 5000 booking for 3 months
    for (const doctor of doctors) {
      let doctorWorkingDays = workingHours.filter(wh => wh.doctorId === doctor.id)
      let doctorLeaves = leaves.filter(leave => leave.doctorId === doctor.id)
      let slotDuration = doctor.consultation_period

      for (const workingDay of doctorWorkingDays) {
        let timeslot = []
        const workStart = timeToMinutes(workingDay.start_time);
        const workEnd = timeToMinutes(workingDay.end_time === "00:00:00" ? "24:00:00" : workingDay.end_time);

        const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 })
        const startingDate = addDays(weekStart, workingDay.day)

        for (
          let startMinutes = workStart;
          startMinutes + slotDuration <= workEnd;
          startMinutes += slotDuration
        ) {

          const slotStart = setMinutes(
            setHours(startingDate, Math.floor(startMinutes / 60)),
            startMinutes % 60
          );

          const slotEnd = addMinutes(slotStart, slotDuration);

          timeslot.push({
            start: slotStart,
            end: slotEnd
          })
        }

        // 13 weeks for 3 months
        for (let i = 0; i < 13; i++) {
          let shuffleTimeslot = faker.helpers.shuffle(timeslot);
          // select 4 timeslot for a day
          let selectedTimeslot = shuffleTimeslot.slice(0, 4)

          for (let j = 0; j < selectedTimeslot.length; j++) {
            let bookingStart = addWeeks(selectedTimeslot[j].start, i)
            let bookingEnd = addWeeks(selectedTimeslot[j].end, i)

            let isOnLeave = doctorLeaves.filter(leave => leave.start_time < bookingEnd && leave.end_time > bookingStart)[0]
            if (!isOnLeave) {
              let patient = faker.helpers.arrayElement(patients)
              data.push({
                status: "Booked",
                start_time: bookingStart,
                end_time: bookingEnd,
                createdAt: new Date(),
                updatedAt: new Date(),
                doctorId: doctor.id,
                patientId: patient.id
              })
            }
          }
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
