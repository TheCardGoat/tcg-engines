import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  assertProductionEligibleRiftboundCatalog,
  generateRiftboundCatalogFiles,
  verifyRiftboundCatalog,
} from "./index.ts";
import type { RiftboundCatalog } from "@tcg/riftbound-types";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const command = process.argv[2];
  const input = option("input");
  if (!input) throw new Error("--input is required");
  const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const inputPath = path.isAbsolute(input) ? input : path.resolve(workspaceRoot, input);

  if (command === "generate") {
    const configuredOutput = option("out") ?? ".cache/generated";
    const outputDirectory = path.isAbsolute(configuredOutput)
      ? configuredOutput
      : path.resolve(workspaceRoot, configuredOutput);
    const production = process.argv.includes("--production");
    const catalog = await generateRiftboundCatalogFiles({
      snapshotPath: inputPath,
      outputDirectory,
      production,
    });
    console.log(`Wrote ${catalog.cards.length} cards to ${outputDirectory}.`);
    return;
  }

  if (command === "verify") {
    const catalog = JSON.parse(await readFile(inputPath, "utf8")) as RiftboundCatalog;
    if (process.argv.includes("--production")) {
      assertProductionEligibleRiftboundCatalog(catalog);
    } else {
      verifyRiftboundCatalog(catalog);
    }
    console.log(`Verified ${catalog.cards.length} Riftbound cards.`);
    return;
  }

  throw new Error("Usage: cli.ts generate|verify --input path [--out path] [--production]");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
