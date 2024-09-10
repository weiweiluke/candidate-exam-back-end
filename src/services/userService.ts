// services/userService.ts
import User from '../models/User';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await User.findOne({ where: { email: email } });
};

export const createUser = async (user: User): Promise<User | null> => {
  // Check if email and password are provided
  if (!user.email || !user.password) {
    throw new Error('Email and password are required');
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error('Invalid email format');
  }
  // Validate user input
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(user.password) && !user.isGoogleRegistered) {
    throw new Error(
      'Password must be at least 8 characters long and contain at least one digit, one special character, one lowercase letter, and one uppercase letter'
    );
  }

  // Check if user already exists
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password before storing it
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  user.password = hashedPassword;

  // Create the user
  const createdUser = await user.save();
  createdUser.password = '';
  return createdUser;
};

export const updateUserEmailVerification = async (userInfo: User) => {
  if (!userInfo) {
    throw new Error('User not found');
  }

  // Update the email verification status
  userInfo.isEmailVerified = true;

  // Save the updated user
  const updatedUser = await userInfo.update({ isEmailVerified: true });
  return updatedUser;
};

export const updateUserPassword = async (
  userInfo: User,
  newPassword: string
) => {
  if (!userInfo) {
    throw new Error('User not found');
  }

  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      'Password must be at least 8 characters long and contain at least one digit, one special character, one lowercase letter, and one uppercase letter'
    );
  }
  // Hash the new password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update the password
  userInfo.password = hashedPassword;

  // Save the updated user
  const updatedUser = await userInfo.update({ password: hashedPassword });
  return updatedUser;
};

export const updateUserName = async (
  userInfo: User,
  firstName: string,
  lastName: string
) => {
  if (!userInfo) {
    throw new Error('User not found');
  }

  // Update the user information
  const updatedUser = await userInfo.update({ firstName, lastName });
  return updatedUser;
};
