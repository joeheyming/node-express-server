import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

import { serverSettings, logMessages, winstonSettings } from '../config';
import { dbConnection, dbDisconnection } from './utils';
import { authVerifyMid } from './middlewares/auth';

import routes from './routes';

const app = express();
const serverPort = serverSettings.port;
const isProd = process.env.NODE_ENV === 'production';

const sessionSettings = session({
  secret: serverSettings.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    name: serverSettings.cookie.name,
    duration: 30 * 60 * 1000, // 30 minutes
    activeDuration: 5 * 60 * 1000, // 5 minutes
    maxAge: 3600000,
    secure: true,
    httpOnly: true,
    ephemeral: true
  }
});

const SERVER = app.listen(serverPort, async () => {
  console.info(logMessages.server.connection, serverSettings.port);
  try {
    const res = await dbConnection();
    console.log(res);
  } catch(err) {
    console.error(err);
  }
});

process.on('SIGINT', () => {
  SERVER.close(async () => {
    try {
      const res = await dbDisconnection();
      console.log(res);
    } catch(err) {
      console.error(err)
    }
    console.log(logMessages.server.disconnection);
    process.exit(0);
  });
});

process.on('uncaughtException', er => {
  console.error(er.stack);
  process.exit(1);
});

app.use(sessionSettings);
app.use(cors());
app.options('*', cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined', { stream: winstonSettings.stream }));

// TODO: optimize and refactor
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/api/v1/', routes);

app.get('/', authVerifyMid, (req, res) => {
  res.json({
    auth: false
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.use((err, req, res, next) => {
  winstonSettings.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  res.status(err.status || 500).json({
    errors: {
      message: err.message,
      error: isProd ? {} : err
    }
  });

  next(err);
});
