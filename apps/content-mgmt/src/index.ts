import { createApp } from "./app";
import { env } from "./config/env";
import { closeDatabase } from "./db/client";

const app = createApp();

app.listen(env.PORT);

console.log(`🚀 Content Management Service is running at http://localhost:${env.PORT}`);
console.log(`   Auth Service URL: ${env.AUTH_SERVICE_URL}`);
console.log(`   Environment: ${env.NODE_ENV}`);

/**
 * Graceful shutdown handler
 *
 * Closes database connections before exiting to prevent
 * abrupt connection termination and potential data loss.
 */
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  try {
    // Stop accepting new connections
    await app.stop();
    console.log("Server stopped accepting new connections");

    // Close database connections
    await closeDatabase();
    console.log("Database connections closed");

    console.log("Graceful shutdown complete");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
}

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
