const { USER_STATUS } = require("../constant/auth");

module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Recruiter = sequelize.define(
    "recruiters",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      auth_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "recruiters",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  Recruiter.associate = (models) => {
    Recruiter.belongsTo(models.companies, { foreignKey: "company_id" });
    Recruiter.belongsTo(models.auths, { foreignKey: "auth_id" });
  };
  return Recruiter;
};
