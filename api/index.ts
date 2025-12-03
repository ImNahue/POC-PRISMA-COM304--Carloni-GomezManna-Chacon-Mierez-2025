import 'dotenv/config';
import app from '../backend/src/app';
import serverless from 'serverless-http';

export const handler = serverless(app);
