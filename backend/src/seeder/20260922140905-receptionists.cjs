'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let emails = faker.helpers.uniqueArray(faker.internet.email, 10)
    let now = new Date()

    let data = [
      {
        name: "Receptionist Test Account",
        email: "reception@test.com",
        password: bcrypt.hashSync("password", 10),
        createdAt: now,
        updatedAt: now,
      }
    ]

    for (let i = 0; i < 10; i++) {
      data.push({
        name: faker.person.fullName(),
        email: emails[i],
        password: bcrypt.hashSync("password", 10),
        createdAt: now,
        updatedAt: now,
      })
    }

    await queryInterface.bulkInsert('receptionist', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('receptionist', null, {});
  }
};
