import 'dotenv/config';
// Import backend source; Vercel will compile TypeScript during the build step
import app from './backend/src/app';
import serverless from 'serverless-http';

export const handler = serverless(app);
