// config.ts
import { Config } from './config.interface';
const config: Config = {
  forceSync: true,
  JWT_SECRET: 'RUNDOM_SECRET',
  db: {
    host: 'localhost',
    port: 3306,
    username: 'fs_exam',
    password: 'aa123456',
    database: 'fs_exam',
  },
  serverPort: 5000,
  googleCallBackUrl: 'http://localhost:3000/oauth2callback',
  verificationLink: 'http://localhost:3001/#/checkemail?token=',
  corsUrl: ['http://localhost:3001'],
  swaggerUrl: 'http://localhost:5000/api-docs',
};

export default config;
