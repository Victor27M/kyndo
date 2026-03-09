/**
 * api/custom-request.ts
 * Entry point for custom requests endpoint
 */

import { loadConfig } from '@api/config';
import { handler } from '@api/controllers/CustomRequestController';

// Load config on startup
loadConfig();

export default handler;
