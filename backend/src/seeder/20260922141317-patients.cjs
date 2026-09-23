'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let emails = faker.helpers.uniqueArray(faker.internet.email, 30)
    let now = new Date()

    let data = [
      {
        name: "Patient Test Account",
        email: "patient@test.com",
        password: bcrypt.hashSync("password", 10),
        createdAt: now,
        updatedAt: now,
      }
    ]

    for (let i = 0; i < 30; i++) {
      data.push({
        name: faker.person.fullName(),
        email: emails[i],
        password: bcrypt.hashSync("password", 10),
        createdAt: now,
        updatedAt: now,
      })
    }

    await queryInterface.bulkInsert('patient', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('patient', null, {});
  }
};
