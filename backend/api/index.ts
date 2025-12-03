import app from '../src/app';
import serverless from 'serverless-http';

// Export the serverless handler for Vercel (Node 18+)
export const handler = serverless(app);
