import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.PORT);

console.log(
  `🚀 Content Management Service is running at http://localhost:${env.PORT}`,
);
console.log(`   Auth Service URL: ${env.AUTH_SERVICE_URL}`);
console.log(`   Environment: ${env.NODE_ENV}`);
