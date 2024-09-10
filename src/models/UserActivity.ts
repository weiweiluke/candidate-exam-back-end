import {
  Association,
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import User from './User';
import sequelize from '../config/database';

class UserActivity extends Model<
  InferAttributes<UserActivity>,
  InferCreationAttributes<UserActivity>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare activityPath: string; // 新增字段
  declare activityTimestamp: CreationOptional<Date>; // 新增字段
  // 添加关联方法类型
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare static associations: {
    user: Association<UserActivity, User>;
  };
}

UserActivity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    activityPath: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    activityTimestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize, // Pass your Sequelize instance here
    modelName: 'UserActivity',
    tableName: 'user_activities', // Customize the table name if needed
    timestamps: false, // Set to true if you want timestamps
  }
);

// UserActivity.belongsTo(User, {
//   foreignKey: 'userId',
//   targetKey: 'id',
//   as: 'user', // 别名
// });
User.hasMany(UserActivity, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'userActivities', // 别名
});
UserActivity.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

UserActivity.sync({ force: false });
export default UserActivity;
