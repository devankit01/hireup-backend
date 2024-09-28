module.exports = (sequelize, DataTypes, UUIDV4) => {
  const ContactUs = sequelize.define(
    "contact_us",
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
        allowNull: false,
      },
      contact_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country_code: {
        type: DataTypes.STRING,
        defaultValue: "+91",
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "contact_us",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  return ContactUs;
};
