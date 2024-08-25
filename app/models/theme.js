module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Themes = sequelize.define(
    "themes",
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
      tableName: "themes",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  Themes.associate = (models) => {
  };

  return Themes;
};
