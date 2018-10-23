import MongoDB from 'mongoose';

import { dbSettings, logMessages } from '../../config';

const { user, pass, host } = dbSettings;
const connUrl = `mongodb+srv://${user}:${pass}@${host}/test?retryWrites=true`;
const connSettings = {
  useNewUrlParser: true
};

export default async () => {
  await MongoDB.connect(
    connUrl,
    connSettings
  );
  return logMessages.database.connection;
}
