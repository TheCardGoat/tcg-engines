/// <reference types="node" />

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

it("keeps the engine source root limited to stable package entrypoints", () => {
  const sourceRoot = join(import.meta.dirname, "..");
  const rootTypeScriptFiles = readdirSync(sourceRoot)
    .filter((entry) => entry.endsWith(".ts"))
    .sort();

  expect(rootTypeScriptFiles).toEqual(["runtime-api.ts", "simulator-api.ts"]);
});
