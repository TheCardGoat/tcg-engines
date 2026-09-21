import { startNativeHost } from "./host.ts";
const host = startNativeHost({
  port: 5194,
  ...(process.argv.includes("--two-player") ? {} : { opponent: "champion-profile" as const }),
});
console.log("Development-only native practice host:", host.url);
for (const session of host.sessions)
  console.log(`${session.actorId} credential: ${session.credential}`);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, async () => {
    await host.stop();
    process.exit(0);
  });
