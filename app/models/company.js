const { COMPANY_TYPE } = require("../constant/auth");

module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Company = sequelize.define(
    "companies",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_type: {
        type: DataTypes.ENUM(
          COMPANY_TYPE.STARTUP,
          COMPANY_TYPE.MIDSIZE,
          COMPANY_TYPE.MNC
        ),
        allowNull: false,
      },
      auth_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      pincode: { type: DataTypes.STRING, allowNull: true, default: null },
      address: { type: DataTypes.STRING, allowNull: true, default: null },
      state_id: { type: DataTypes.UUID, allowNull: true, default: null },
      district_id: { type: DataTypes.UUID, allowNull: true, default: null },
    },
    {
      tableName: "companies",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  Company.associate = (models) => {
    Company.hasMany(models.companies, { foreignKey: "company_id" });
    Company.belongsTo(models.states, { foreignKey: "state_id" });
    Company.belongsTo(models.districts, { foreignKey: "district_id" });
    Company.belongsTo(models.auths, { foreignKey: "auth_id" });
  };
  return Company;
};
