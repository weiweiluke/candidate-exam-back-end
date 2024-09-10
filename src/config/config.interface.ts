export interface DBConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface Config {
  forceSync: boolean;
  JWT_SECRET: string;
  db: DBConfig;
  serverPort: number;
  googleCallBackUrl: string;
  verificationLink: string;
  corsUrl: string[];
  swaggerUrl: string;
}
