"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tasks", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM("todo", "in_progress", "in_review", "done"),
        allowNull: false,
        defaultValue: "todo",
      },
      priority: {
        type: Sequelize.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "medium",
      },
      due_date: { type: Sequelize.DATEONLY, allowNull: true },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "projects", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      assigned_to_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      created_by_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "RESTRICT",
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
    await queryInterface.addIndex("tasks", ["project_id"]);
    await queryInterface.addIndex("tasks", ["assigned_to_id"]);
    await queryInterface.addIndex("tasks", ["status"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("tasks");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tasks_status";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_tasks_priority";',
    );
  },
};
