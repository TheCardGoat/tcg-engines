import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  PopulatedFleshAndBloodCatalog,
  SparseFleshAndBloodCardDataCatalog,
  SparseFleshAndBloodCatalog,
  SparseFleshAndBloodPrintingsCatalog,
} from "@tcg/flesh-and-blood-types/catalog";
import {
  hydrateFleshAndBloodCatalog,
  hydrateFleshAndBloodCatalogParts,
} from "../../../packages/types/src/catalog-defaults.ts";

import {
  auditFleshAndBloodCatalog,
  generateFleshAndBloodCatalogFiles,
  verifyFleshAndBloodCatalog,
} from "./index.ts";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function loadCatalog(inputPath: string): Promise<PopulatedFleshAndBloodCatalog> {
  const input = JSON.parse(await readFile(inputPath, "utf8")) as
    | SparseFleshAndBloodCatalog
    | SparseFleshAndBloodCardDataCatalog;
  if (input.cards.every((card) => "printings" in card)) {
    return hydrateFleshAndBloodCatalog(input as SparseFleshAndBloodCatalog);
  }
  const printingsPath = path.join(path.dirname(inputPath), "flesh-and-blood-printings.json");
  const printingData = JSON.parse(
    await readFile(printingsPath, "utf8"),
  ) as SparseFleshAndBloodPrintingsCatalog;
  return hydrateFleshAndBloodCatalogParts(
    input as SparseFleshAndBloodCardDataCatalog,
    printingData,
  );
}

async function main(): Promise<void> {
  const command = process.argv[2];
  const input = option("input");
  if (!input) throw new Error("--input is required");
  const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const inputPath = path.isAbsolute(input) ? input : path.resolve(workspaceRoot, input);

  if (command === "generate") {
    const assetManifest = option("asset-manifest");
    if (!assetManifest) throw new Error("--asset-manifest is required");
    const assetManifestPath = path.isAbsolute(assetManifest)
      ? assetManifest
      : path.resolve(workspaceRoot, assetManifest);
    const configuredOutput = option("out") ?? "packages/cards/src/generated";
    const outputDirectory = path.isAbsolute(configuredOutput)
      ? configuredOutput
      : path.resolve(workspaceRoot, configuredOutput);
    const catalog = await generateFleshAndBloodCatalogFiles({
      snapshotPath: inputPath,
      assetManifestPath,
      outputDirectory,
    });
    console.log(`Wrote ${catalog.cards.length} cards to ${outputDirectory}.`);
    return;
  }

  if (command === "verify") {
    const catalog = await loadCatalog(inputPath);
    verifyFleshAndBloodCatalog(catalog);
    console.log(`Verified ${catalog.cards.length} Flesh and Blood cards.`);
    return;
  }

  if (command === "audit") {
    const catalog = await loadCatalog(inputPath);
    console.log(JSON.stringify(auditFleshAndBloodCatalog(catalog), null, 2));
    return;
  }

  throw new Error(
    "Usage: cli.ts generate --input path --asset-manifest path [--out path] | verify|audit --input path",
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
