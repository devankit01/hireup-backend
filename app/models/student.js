module.exports = (sequelize, DataTypes, UUIDV4) => {
  const Student = sequelize.define(
    "students",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      roll_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      college_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      auth_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "students",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  Student.associate = (models) => {
    Student.belongsTo(models.colleges, { foreignKey: "college_id" });
    Student.belongsTo(models.auths, { foreignKey: "auth_id" });
  };
  return Student;
};
