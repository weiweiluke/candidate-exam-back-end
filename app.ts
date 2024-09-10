import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes from './src/routes/user';
import authRoutes from './src/routes/auth';
import dashboardRoutes from './src/routes/dashboard';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import cors from 'cors'; // Import the cors module
import AppError from './src/errors/AppError'; // Import the AppError class
import errorHandler from './src/middleware/errorHandler';
import logger from './src/utils/logger'; // Import the logger instance
import config from './src/config/config';
import authMiddleware from './src/middleware/authMiddleware';
import session from 'express-session';
import sequelize from './src/config/database';
import activityLogger from './src/middleware/ActivityLogger';
import corsMiddleware from './src/middleware/corsMiddleware';
const app = express();

// Middleware
app.use(
  morgan('combined', {
    stream: {
      write: message => logger.info(message.trim()),
    },
  })
);

app.use(corsMiddleware);
app.use(errorHandler);
app.use(authMiddleware);
app.use(activityLogger);
app.use(bodyParser.json());
app.use(cookieParser());
// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: `http://localhost:${config.serverPort}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};
app.use(
  session({
    secret: 'ADZadL6Xk77!6*',
    resave: false,
    saveUninitialized: false,
  })
);
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Sync database and start server
// sequelize.sync({ force: true }).then(() => {
//   app.listen(3000, () => {
//     console.log('Server is running on port 3000');
//   });
// });

app.listen(config.serverPort, () => {
  console.log(`Server is running on port ${config.serverPort}`);
});
