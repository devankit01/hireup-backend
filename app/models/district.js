module.exports = (sequelize, DataTypes, UUIDV4) => {
  const District = sequelize.define(
    "districts",
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "districts",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  District.associate = (models) => {
    District.hasMany(models.auths, { foreignKey: "district_id" });
  };

  return District;
};
