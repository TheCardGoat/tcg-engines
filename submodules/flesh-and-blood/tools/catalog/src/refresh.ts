import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  SparseFleshAndBloodCardDataCatalog,
  SparseFleshAndBloodPrintingsCatalog,
} from "@tcg/flesh-and-blood-types/catalog";
import { hydrateFleshAndBloodCatalogSourceParts } from "../../../packages/types/src/catalog-defaults.ts";

import { FAB_CUBE_DEFAULT_REF, scrapeFabCube, writeRawSnapshot } from "../../scraper/src/index.ts";
import {
  assertNoCatalogRemovals,
  catalogFromSnapshot,
  diffFleshAndBloodCatalogs,
  fabCubeImageSourcesFromSnapshot,
  fleshAndBloodAssetPrintingsFromManifest,
  generateFleshAndBloodCatalogFiles,
} from "./index.ts";
import { generateLocalizedCatalogFiles } from "./localized-generation.ts";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const outputDirectory = path.join(workspaceRoot, "packages/cards/src/generated");
  const cardDataPath = path.join(outputDirectory, "flesh-and-blood-card-data.json");
  const printingsPath = path.join(outputDirectory, "flesh-and-blood-printings.json");
  const previous = hydrateFleshAndBloodCatalogSourceParts(
    JSON.parse(await readFile(cardDataPath, "utf8")) as SparseFleshAndBloodCardDataCatalog,
    JSON.parse(await readFile(printingsPath, "utf8")) as SparseFleshAndBloodPrintingsCatalog,
  );
  const assetManifestOption = option("asset-manifest");
  if (!assetManifestOption) throw new Error("--asset-manifest is required");
  const assetManifestPath = path.resolve(assetManifestOption);
  const assetPrintings = fleshAndBloodAssetPrintingsFromManifest(
    JSON.parse(await readFile(assetManifestPath, "utf8")),
  );
  let previousImageSources: ReadonlyMap<string, string | null> | undefined;
  if (
    previous.provenance?.source === "fab-cube" &&
    /^[a-f0-9]{40}$/.test(previous.provenance.sourceVersion)
  ) {
    const previousSnapshotPath = path.join(
      workspaceRoot,
      ".cache/raw/fab-cube/en-US",
      `${previous.provenance.sourceVersion}.json`,
    );
    try {
      previousImageSources = fabCubeImageSourcesFromSnapshot(
        JSON.parse(await readFile(previousSnapshotPath, "utf8")),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  const sourceRef = option("ref") ?? FAB_CUBE_DEFAULT_REF;
  const snapshot = await scrapeFabCube({
    sourceRef,
    ...(process.env.GITHUB_TOKEN ? { githubToken: process.env.GITHUB_TOKEN } : {}),
  });
  const next = catalogFromSnapshot(snapshot, assetPrintings);
  const nextImageSources = fabCubeImageSourcesFromSnapshot(snapshot);
  const report = diffFleshAndBloodCatalogs(
    previous,
    next,
    previousImageSources ? { previous: previousImageSources, next: nextImageSources } : undefined,
  );
  if (!process.argv.includes("--allow-removals")) assertNoCatalogRemovals(report);

  const snapshotPath = await writeRawSnapshot(snapshot, path.join(workspaceRoot, ".cache/raw"));
  await generateFleshAndBloodCatalogFiles({
    snapshotPath,
    assetManifestPath,
    outputDirectory,
  });
  const localized = await generateLocalizedCatalogFiles({
    workspaceRoot,
    assetManifestPath,
    sourceRef: snapshot.sourceRef,
    sourceVersion: snapshot.sourceVersion,
    ...(process.env.GITHUB_TOKEN ? { githubToken: process.env.GITHUB_TOKEN } : {}),
  });
  console.log(
    JSON.stringify(
      {
        sourceRef: snapshot.sourceRef,
        sourceVersion: snapshot.sourceVersion,
        snapshotPath,
        localized,
        report,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
