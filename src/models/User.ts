/**
 * Represents a User model.
 *
 * @class
 */
import sequelize from '../config/database';
import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  Association,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { Permission } from '../types/entity';
import UserActivity from './UserActivity';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare isGoogleRegistered: boolean;
  declare isEmailVerified: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare permission: Permission[];
  declare role: any;
  declare username: string;
  declare lastSession: CreationOptional<Date>;
  declare loginCount: number;
  // 添加关联方法类型
  declare getUserActivities: HasManyGetAssociationsMixin<UserActivity>;

  // 添加关联
  declare static associations: {
    userActivities: Association<User, UserActivity>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isGoogleRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    permission: {
      type: DataTypes.VIRTUAL,
    },
    role: {
      type: DataTypes.VIRTUAL,
    },
    username: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    lastSession: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    loginCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    timestamps: true,
  }
);

User.sync({ force: false });

export default User;
