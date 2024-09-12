import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger'; // Import the logger instance
import config from './config/config';
import authMiddleware from './middleware/authMiddleware';
import session from 'express-session';
import activityLogger from './middleware/activityLogger';
import corsMiddleware from './middleware/corsMiddleware';
import { describe } from 'node:test';
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
      title: 'Full-Stack Engineer Exam API Documentation',
      version: '1.0.0',
      description: `API Documentation for Full-Stack Engineer Interview Exam System`,
    },
    servers: [
      {
        url: config.swaggerUrl,
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
      responses: {
        SuccessResponse: {
          description: 'Request Successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'integer',
                    example: 0,
                    description:
                      'operation status,0 for success,other for failure',
                  },
                  data: {
                    type: 'object',
                    example: { id: 1, name: 'test', age: 20 },
                    description: 'response data',
                  },
                  message: {
                    type: 'string',
                    example: 'success',
                    description: 'response message',
                  },
                },
              },
            },
          },
        },
      },
      schema: {
        user: {
          description: 'user model',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    example: 1,
                    describe: 'user id',
                  },
                  email: {
                    type: 'string',
                    example: 'foo@bar.com',
                    describe: 'user email',
                  },
                  firstName: {
                    type: 'string',
                    example: 'Foo',
                    describe: 'user first name',
                  },
                  lastName: {
                    type: 'string',
                    example: 'Bar',
                    describe: 'user last name',
                  },
                  isGoogleRegistered: {
                    type: 'boolean',
                    example: false,
                    describe: 'is user registered with google',
                  },
                  isEmailVerified: {
                    type: 'boolean',
                    example: false,
                    describe: 'is user email verified',
                  },
                  createdAt: {
                    type: 'string',
                    example: '2021-01-01',
                    describe: 'user created date',
                  },
                  updatedAt: {
                    type: 'string',
                    example: '2021-01-01',
                    describe: 'user updated date',
                  },
                  lastSession: {
                    type: 'string',
                    example: '2021-01-01',
                    describe: 'user last session date',
                  },
                  loginCount: {
                    type: 'integer',
                    example: 1,
                    describe: 'user login count',
                  },
                  fullname: {
                    type: 'string',
                    example: 'Foo Bar',
                    describe: 'user full name',
                  },
                },
              },
            },
          },
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
