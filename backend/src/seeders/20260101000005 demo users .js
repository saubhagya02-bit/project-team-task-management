"use strict";
const bcrypt = require("bcryptjs");
const { randomUUID: uuidv4 } = require("crypto");

module.exports = {
  up: async (queryInterface) => {
    const hash = async (pwd) => bcrypt.hash(pwd, 10);

    const adminId = uuidv4();
    const pmId = uuidv4();
    const memberId = uuidv4();

    await queryInterface.bulkInsert("users", [
      {
        id: adminId,
        name: "System Admin",
        email: "admin@pmt.test",
        password: await hash("Admin@123"),
        role: "admin",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: pmId,
        name: "Priya Manager",
        email: "pm@pmt.test",
        password: await hash("Manager@123"),
        role: "project_manager",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: memberId,
        name: "Sam Developer",
        email: "member@pmt.test",
        password: await hash("Member@123"),
        role: "team_member",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", {
      email: ["admin@pmt.test", "pm@pmt.test", "member@pmt.test"],
    });
  },
};
