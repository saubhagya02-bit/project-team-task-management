const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: true, len: [2, 150] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("planning", "active", "on_hold", "completed"),
      allowNull: false,
      defaultValue: "planning",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "end_date",
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "manager_id",
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Project;
