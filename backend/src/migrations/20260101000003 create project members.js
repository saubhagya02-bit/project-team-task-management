"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("project_members", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "projects", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
    await queryInterface.addIndex(
      "project_members",
      ["project_id", "user_id"],
      {
        unique: true,
        name: "project_members_project_user_unique",
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("project_members");
  },
};
