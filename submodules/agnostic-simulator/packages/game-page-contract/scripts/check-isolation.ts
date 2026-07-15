#!/usr/bin/env bun
/**
 * Verifies that `@tcg/game-page-contract` has zero engine deps. Any dep
 * matching `@tcg/(lorcana|gundam|cyberpunk|riftbound)*` (in any of the
 * dependency-listing fields) is a contract violation — fail loudly.
 *
 * Run via `bun run check:isolation`.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(here, "..", "package.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as Record<string, unknown>;

const FORBIDDEN = /^@tcg\/(lorcana|gundam|cyberpunk|riftbound)/;
const FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;

const violations: string[] = [];
for (const field of FIELDS) {
  const deps = pkg[field];
  if (!deps || typeof deps !== "object") continue;
  for (const name of Object.keys(deps as Record<string, unknown>)) {
    if (FORBIDDEN.test(name)) {
      violations.push(`${field}: ${name}`);
    }
  }
}

if (violations.length > 0) {
  console.error("@tcg/game-page-contract must have zero engine deps. Found:");
  for (const v of violations) console.error("  -", v);
  process.exit(1);
}

console.log("@tcg/game-page-contract: isolation OK (no engine deps in package.json).");
