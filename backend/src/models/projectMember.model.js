const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class ProjectMember extends Model {}

ProjectMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "project_id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
  },
  {
    sequelize,
    modelName: "ProjectMember",
    tableName: "project_members",
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["project_id", "user_id"] }],
  },
);

module.exports = ProjectMember;
