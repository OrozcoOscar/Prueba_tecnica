import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './db.js';
import { ensureAdminUser } from './services/seedAdmin.js';

const start = async () => {
  try {
    await prisma.$connect();
    await ensureAdminUser();
    app.listen(env.port, () => {
      console.log(`API running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
