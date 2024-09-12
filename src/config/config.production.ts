// config.ts
import { Config } from './config.interface';
const config: Config = {
  forceSync: true,
  JWT_SECRET: 'RUNDOM_SECRET',
  db: {
    host: 'wordpress-db',
    port: 3306,
    username: 'root',
    password: 'pscreen123',
    database: 'exam',
  },
  serverPort: 5000,
  googleCallBackUrl: 'https://exam.ludan.online/oauth2callback',
  verificationLink: 'https://exam.ludan.online/#/checkemail?token=',
  corsUrl: ['https://exam.ludan.online'],
  swaggerUrl: 'https://exam.ludan.online/api',
};

export default config;
