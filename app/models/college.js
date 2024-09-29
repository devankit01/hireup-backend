module.exports = (sequelize, DataTypes, UUIDV4) => {
  const College = sequelize.define(
    "colleges",
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
      college_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: "colleges",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  College.associate = (models) => {
    College.hasMany(models.students, { foreignKey: "college_id" });
    College.belongsTo(models.states, { foreignKey: "state_id" });
    College.belongsTo(models.districts, { foreignKey: "district_id" });
    College.belongsTo(models.auths, { foreignKey: "auth_id" });
  };
  return College;
};
