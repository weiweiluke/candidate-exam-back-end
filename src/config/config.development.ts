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
  googleCallBackUrl: 'http://localhost:3001/oauth2callback',
  verificationLink: 'http://localhost:3001/#/checkemail?token=',
  swaggerUrl: 'http://localhost:5000',
  corsUrl: ['http://localhost:3001', 'http://localhost:5000'],
};

export default config;
