module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Otp = sequelize.define(
    "otps",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
      },
      otp: {
        type: DataTypes.STRING(500),
      },
      otp_token: {
        type: DataTypes.STRING,
      },
      otp_attempt: {
        type: DataTypes.INTEGER,
      },
      otp_last_attempt: {
        type: DataTypes.DATE,
      },
      phone: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "otps",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  return Otp;
};
