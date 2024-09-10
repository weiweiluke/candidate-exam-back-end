import UserActivity from '../models/UserActivity';
import User from '../models/User';

export async function recordUserActivity(userId: number, reqPath: string) {
  const user = await User.findByPk(userId);
  if (user) {
    if (reqPath.indexOf('signin') >= 0 || reqPath.indexOf('google-auth') >= 0) {
      user.loginCount = (user?.loginCount || 0) + 1;
    }
    user.lastSession = new Date();
    user.save();
  }
  const userActivity = UserActivity.build({
    userId,
    activityPath: reqPath,
    activityTimestamp: new Date(),
  });
  userActivity.save();
}
