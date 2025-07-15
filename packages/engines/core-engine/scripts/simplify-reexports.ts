#!/usr/bin/env bun

import { readFile, writeFile } from "node:fs/promises";

async function simplifyLobbyReexports() {
  const filePath = "src/lobby.ts";
  const content = await readFile(filePath, "utf-8");

  // Remove redundant specific exports that are already covered by export *
  // Remove the broken ServerMessageType export
  // Replace the duplicate exhaustiveCheck with an import from shared
  const newContent = `export * from "./lobby-engine/lobby-engine";
export type * from "./lobby-engine/lobby-engine-types";
export * from "./lobby-engine/lobby-messages-type";
export * from "./lobby-engine/side-effects-adapter";
export type { EngineLogger } from "./shared/logger";
export { exhaustiveCheck } from "./shared/exhaustiveCheck";
`;

  await writeFile(filePath, newContent);
  console.log(`Simplified re-exports in ${filePath}`);
}

async function checkMainIndexReexports() {
  const filePath = "src/index.ts";
  const content = await readFile(filePath, "utf-8");

  // Check if there are any redundant exports
  console.log("Current main index.ts exports:");
  console.log(content);

  // The main index looks clean, but let's verify the ~ import works
  // The ~ import should resolve to the game-engine/core-engine directory
}

async function main() {
  console.log("=== SIMPLIFYING RE-EXPORT CHAINS ===\n");

  await simplifyLobbyReexports();
  await checkMainIndexReexports();

  console.log("\n=== RE-EXPORT SIMPLIFICATION COMPLETE ===");
}

if (import.meta.main) {
  main().catch(console.error);
}
