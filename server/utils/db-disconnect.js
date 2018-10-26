import MongoDB from 'mongoose';
import { logMessages } from '../../config';

export default async () => {
  await MongoDB.disconnect();
  return logMessages.database.disconnection;
}
