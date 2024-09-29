const { USER_TYPE, USER_STATUS } = require("../constant/auth");

module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Auth = sequelize.define(
    "auths",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
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
      email_verified_at: { type: DataTypes.DATE, allowNull: true },
      contact_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(
          USER_TYPE.COLLEGE,
          USER_TYPE.COMPANY,
          USER_TYPE.RECRUITER,
          USER_TYPE.STUDENT,
        ),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          USER_STATUS.ACTIVE,
          USER_STATUS.DELETED,
          USER_STATUS.IN_ACTIVE,
          USER_STATUS.PENDING,
        ),
        defaultValue: USER_STATUS.PENDING,
      },
    },
    {
      tableName: "auths",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  Auth.associate = (models) => {
    Auth.hasMany(models.sessions, { foreignKey: "auth_id" });
    Auth.hasOne(models.colleges, { foreignKey: "auth_id" });
    Auth.hasOne(models.companies, { foreignKey: "auth_id" });
    Auth.hasOne(models.students, { foreignKey: "auth_id" });
  };
  return Auth;
};
