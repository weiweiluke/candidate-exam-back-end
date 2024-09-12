import { OAuth2Client } from 'google-auth-library';
import config from '../config/config';

export async function getAuthenticatedClient(): Promise<OAuth2Client> {
  return new Promise((resolve, reject) => {
    try {
      // Just for exam, dont use this in production
      const oAuth2Client = new OAuth2Client({
        clientId:
          '438464651125-i3veiab637kbh1jan0p9v8qg4jbkl2jr.apps.googleusercontent.com',
        clientSecret: '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',
        redirectUri: config.googleCallBackUrl,
      });

      resolve(oAuth2Client);
    } catch (error) {
      reject(error);
    }
  });
}
