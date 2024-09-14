module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Session = sequelize.define(
    "sessions",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      device_id: {
        type: DataTypes.STRING,
      },
      device_token: {
        type: DataTypes.STRING,
      },
      device_type: {
        type: DataTypes.STRING,
      },
      jwt_token: {
        type: DataTypes.STRING(500),
      },
      refresh_token: {
        type: DataTypes.STRING(500),
      },
    },
    {
      tableName: "sessions",
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );

  Session.associate = (models) => {
    Session.belongsTo(models.auths, { foreignKey: "auth_id" });
  };

  return Session;
};
