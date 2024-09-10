import { Op, Sequelize } from 'sequelize';
import User from '../models/User';
import UserActivity from '../models/UserActivity';
import { ResponseEnum, ResponseTypeBuilder } from '../utils/responseFormatter';
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  // get all users from the database
  // return the list of users
  try {
    const users = await User.findAll();
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<any>()
          .SUCCESS(ResponseEnum.OperationSuccess)
          .setData(users)
          .build()
      );
  } catch (error) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .ERROR(ResponseEnum.UserNotFoundError)
          .build()
      );
  }
};

export const getStatistics = async (req: Request, res: Response) => {
  let totalUsers: number,
    activeSessionsToday,
    avgActiveSessions = 0;

  try {
    // get the total number of users
    totalUsers = await User.count();
    const activeSessionsTodayByUser = await UserActivity.count({
      where: {
        activityTimestamp: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      group: ['userId'],
    });

    // get the number of active sessions today
    activeSessionsToday = activeSessionsTodayByUser.length;

    // get the average number of active sessions in the last 7 days
    avgActiveSessions =
      (
        await UserActivity.count({
          attributes: [
            'userId',
            [
              Sequelize.fn('DATE', Sequelize.col('activityTimestamp')),
              'activityDate',
            ],
          ],
          where: {
            activityTimestamp: {
              [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
          group: [
            'userId',
            Sequelize.fn('DATE', Sequelize.col('activityTimestamp')),
          ],
        })
      ).length / 7;
  } catch (error) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>().ERROR(ResponseEnum.OperationFailed).build()
      );
  }
  return res
    .status(200)
    .json(
      ResponseTypeBuilder<any>()
        .SUCCESS(ResponseEnum.OperationSuccess)
        .setData({ totalUsers, activeSessionsToday, avgActiveSessions })
        .build()
    );
};
