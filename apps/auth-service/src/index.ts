import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.AUTH_PORT);

console.log(`🔐 Auth Service is running at ${app.server?.hostname}:${app.server?.port}`);
