import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import chalk from 'chalk';

import { serverSettings, logMessages } from '../config';
import { dbConnection, dbDisconnection } from './utils';

import routes from './routes';

const app = express();
const serverPort = serverSettings.port;

const SERVER = app.listen(serverPort, async () => {
  console.clear();
  console.info(chalk.green(logMessages.server.connection), serverSettings.port);
  try {
    const res = await dbConnection();
    console.log(chalk.green(res));
  } catch(err) {
    console.error(chalk.red(err));
  }
});

process.on('SIGINT', () => {
  SERVER.close(async () => {
    try {
      const res = await dbDisconnection();
      console.clear();
      console.log(chalk.yellow(res));
    } catch(err) {
      console.error(chalk.red(err));
    }
    console.log(chalk.yellow(logMessages.server.disconnection));
    process.exit(0);
  });
});

// Configure CORS
app.use(cors());
app.options('*', cors()); // include before other routes

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use(routes);

app.use(
  session({
    secret: 'test session',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true }
  })
);

app.get('/check', function(req, res) {
  res.json({
    TEST: 'Welcome to the Node express JWT Tutorial'
  });
});
