module.exports = (sequelize, DataTypes, UUIDV4) => {
  const State = sequelize.define(
    "states",
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
      union_territory: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "states",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  State.associate = (models) => {
    State.hasMany(models.auths, { foreignKey: "state_id" });
  };

  return State;
};
