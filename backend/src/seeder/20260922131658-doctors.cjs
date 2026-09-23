'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = []
    let emails = faker.helpers.uniqueArray(faker.internet.email, 50)
    let now = new Date()

    for (let i = 0; i < 50; i++) {
      data.push({
        name: faker.person.fullName(),
        email: emails[i],
        password: bcrypt.hashSync("password", 10),
        consultation_period: faker.helpers.arrayElement([15, 30]),
        createdAt: now,
        updatedAt: now,
      })
    }

    await queryInterface.bulkInsert('doctor', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctor', null, {});
  }
};
