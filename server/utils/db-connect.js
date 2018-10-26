import MongoDB from 'mongoose';

import { dbSettings, logMessages } from '../../config';

const { user, pass, host } = dbSettings;
const connUrl = `mongodb+srv://${user}:${pass}@${host}/test?retryWrites=true`;
const connSettings = {
  useNewUrlParser: true
};

export default async () => {
  try {
    await MongoDB.connect(
      connUrl,
      connSettings
    );
    return logMessages.database.connection;
  } catch(err) {
    return err;
  }
};
