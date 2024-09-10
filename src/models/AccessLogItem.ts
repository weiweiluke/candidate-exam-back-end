import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class AccessLogItem extends Model {
  public id!: number;
  public email!: string;
  public accessTime!: Date;
  public apiPath!: string;
  public apiCode!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AccessLogItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accessTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    apiPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apiCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'access_log_items',
    sequelize,
  }
);

export default AccessLogItem;
