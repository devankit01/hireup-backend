const { USER_STATUS, COMPANY_TYPE } = require("../constant/auth");

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
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      contact_number: {
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
      status: {
        type: DataTypes.ENUM(
          USER_STATUS.ACTIVE,
          USER_STATUS.DELETED,
          USER_STATUS.IN_ACTIVE,
          USER_STATUS.PENDING
        ),
        defaultValue: USER_STATUS.PENDING,
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
    Company.belongsTo(models.states, { foreignKey: "state_id" });
    Company.belongsTo(models.districts, { foreignKey: "district_id" });
    Company.belongsTo(models.auths, { foreignKey: "id" });
  };
  return Company;
};
