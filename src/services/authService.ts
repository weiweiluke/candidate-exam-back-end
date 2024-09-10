// authService.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config/config';
import axios from 'axios';
import { ADMIN_ROLE } from '../mock/_userdata';
import User from '../models/User';

// Zoho email configuration, Just for demonstration
const ZOHO_REFRESH_TOKEN =
  '1000.31ad5f5fa12220eb317ec8f0878bf263.2ec6a9df1e396be02e775f486631099a';
const ZOHO_CLIENT_ID = '1000.9JXG7U36EGU9W4DI6PR72F03E7HY4Y';
const ZOHO_CLIENT_SECRET = '34ac63f884c8d2eb789c58826aae605ed291371639';
const ZOHO_TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token';
const ZOHO_EMAIL_API_URL =
  'https://mail.zoho.com/api/accounts/7326757000000008002/messages';
const ZOHO_EMAIL = 'admin@ludan.online';
const VERIFICATION_LINK = config.verificationLink;

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid && !user.isGoogleRegistered) {
    throw new Error('Invalid password');
  }

  // create a token, just read secret from env file
  const token: string = jwt.sign({ email: user.email }, config.JWT_SECRET, {
    expiresIn: '7d',
  });
  // delete user.password;
  user.password = '';
  //mock data for exam
  user.role = ADMIN_ROLE;
  user.permission = ADMIN_ROLE.permission;
  return { token, user };
};

export const sendResetPasswordEmail = async (email: string) => {
  // send email logic
};

export const sendVerificationEmail = async (email: string) => {
  // send email logic
  const token = await generateEmailToken(email);
  const verificationLink = VERIFICATION_LINK + token;

  const emailData = {
    fromAddress: ZOHO_EMAIL,
    toAddress: email,
    subject: 'Please verify your email address',
    content: `<p>Please click the following link to verify your email:</p>
              <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>`,
  };
  const apiToken = await generateApiToken();
  try {
    const response = await axios.post(ZOHO_EMAIL_API_URL, emailData, {
      headers: {
        Authorization: `Zoho-oauthtoken ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      console.log('Verification email sent successfully : ' + email);
    } else {
      console.error('Failed to send verification email', response.data);
    }
  } catch (error) {
    console.error('Error occurred while sending verification email', error);
  }
};

const generateApiToken = async () => {
  //  generate api token by refreshtoken
  try {
    const response = await axios.post(ZOHO_TOKEN_URL, null, {
      params: {
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
      },
    });

    if (response.status === 200) {
      return response.data.access_token;
    } else {
      console.error('Failed to obtain access token', response.data);
      return '';
    }
  } catch (error) {
    console.error('Error occurred while obtaining access token', error);
    return '';
  }
};

const generateEmailToken = async (email: string) => {
  const token = jwt.sign({ e: email, v: true }, config.JWT_SECRET, {
    expiresIn: '1d',
  });
  // generate token logic
  return token;
};

export const verifyEmailToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      e: string;
      v: boolean;
    };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
