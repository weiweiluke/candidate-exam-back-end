import { OAuth2Client } from 'google-auth-library';
import config from '../config/config';

export async function getAuthenticatedClient(): Promise<OAuth2Client> {
  return new Promise((resolve, reject) => {
    try {
      // Just for exam, dont use this in production
      const oAuth2Client = new OAuth2Client({
        clientId: '',
        clientSecret: '',
        redirectUri: config.googleCallBackUrl,
      });

      resolve(oAuth2Client);
    } catch (error) {
      reject(error);
    }
  });
}
