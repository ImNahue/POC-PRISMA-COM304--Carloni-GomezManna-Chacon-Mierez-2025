import 'dotenv/config';
// Import compiled backend for runtime (ensure backend was built during vercel build)
import app from './backend/dist/app';
import serverless from 'serverless-http';

export const handler = serverless(app);
