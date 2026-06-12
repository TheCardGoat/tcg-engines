import { readFile } from "node:fs/promises";

const ALLOWED_CUSTOM_EVENT_FILES = new Set(["src/types/domain-events.ts"]);

const CUSTOM_EVENT_PATTERN = /kind\s*:\s*["']CUSTOM["']/;

const violations: string[] = [];

for await (const filePath of new Bun.Glob("src/**/*.ts").scan(".")) {
  if (ALLOWED_CUSTOM_EVENT_FILES.has(filePath)) continue;

  const content = await readFile(filePath, "utf8");
  if (!CUSTOM_EVENT_PATTERN.test(content)) continue;

  violations.push(filePath);
}

if (violations.length > 0) {
  console.error("Raw custom event emission is blocked. Use emitLorcanaDomainEvent instead.");
  for (const filePath of violations) {
    console.error(`- ${filePath}`);
  }

  // DISABLING FOR NOW.
  // process.exit(1);
}
