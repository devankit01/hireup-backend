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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      contact_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      organization_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM(
          USER_TYPE.CRS,
          USER_TYPE.SUB_ADMIN,
          USER_TYPE.SUPER_ADMIN,
        ),
        defaultValue: USER_TYPE.CRS,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          USER_STATUS.ACTIVE,
          USER_STATUS.DELETED,
          USER_STATUS.IN_ACTIVE,
        ),
        defaultValue: USER_STATUS.ACTIVE,
      },
      approval: {
        type: DataTypes.ENUM(
          USER_STATUS.PENDING,
          USER_STATUS.APPROVED,
          USER_STATUS.REJECTED,
          USER_STATUS.IN_COMPLETE,
        ),
        defaultValue: USER_STATUS.IN_COMPLETE,
      },
      login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      application_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      declaration_date: {
        type: DataTypes.DATE,
      },
      total_approved_files: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      total_audio_files: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      pincode: { type: DataTypes.STRING, allowNull: true, default: null },
      address: { type: DataTypes.STRING, allowNull: true, default: null },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      email_verified_at: { type: DataTypes.DATE, allowNull: true },
      approved_at: { type: DataTypes.DATE, allowNull: true },
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
  Auth.beforeCreate((auth, options) => {
    if (auth.role === USER_TYPE.SUB_ADMIN) {
      auth.approval = USER_STATUS.APPROVED;
    }
  });
  Auth.associate = (models) => {
    Auth.hasMany(models.sessions, { foreignKey: "auth_id" });
    Auth.belongsTo(models.states, { foreignKey: "state_id" });
    Auth.belongsTo(models.districts, { foreignKey: "district_id" });
  };
  return Auth;
};
