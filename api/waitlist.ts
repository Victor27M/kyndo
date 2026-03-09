/**
 * api/waitlist.ts
 * Entry point for waitlist endpoint
 * Routes requests to the WaitlistController
 */

import { loadConfig } from '@api/config';
import { handler } from '@api/controllers/WaitlistController';

// Load config on startup
loadConfig();

export default handler;
