import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import type {
  FleshAndBloodLocalizedPrintingsCatalog,
  FleshAndBloodPrinting,
} from "@tcg/flesh-and-blood-types/catalog";

import {
  FAB_CUBE_DEFAULT_REF,
  FAB_CUBE_LANGUAGES,
  scrapeFabCube,
  writeRawSnapshot,
  type FabCubeLanguage,
} from "../../scraper/src/index.ts";

import { catalogKeyIndex, extractLocalizedCatalogData } from "./localized.ts";
import { fleshAndBloodAssetPrintingsFromManifest } from "./index.ts";

const CatalogKeysSchema = z.object({
  provenance: z.object({ sha256: z.string().min(1) }).nullable(),
  cards: z.array(z.object({ canonicalId: z.string().min(1) })),
  sets: z.array(z.object({ id: z.string().min(1) })),
});

export const DEFAULT_LOCALIZED_LANGUAGES = FAB_CUBE_LANGUAGES.filter(
  (language): language is Exclude<FabCubeLanguage, "english"> => language !== "english",
);

export interface LocalizedGenerationSummary {
  language: Exclude<FabCubeLanguage, "english">;
  locale: string;
  sourceVersion: string;
  snapshotPath: string;
  translationsPath: string;
  printingsPath: string;
  matchedCards: number;
  unmatchedCards: readonly string[];
  matchedSets: number;
  unmatchedSets: readonly string[];
  printings: number;
}

function sortedPrintingsByCanonicalId(
  value: Record<string, FleshAndBloodPrinting[]>,
): Record<string, FleshAndBloodPrinting[]> {
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([canonicalId, printings]) => [
        canonicalId,
        [...printings].sort((left, right) => left.id.localeCompare(right.id)),
      ]),
  );
}

export async function generateLocalizedCatalogFiles(options: {
  workspaceRoot: string;
  assetManifestPath: string;
  sourceRef?: string;
  sourceVersion?: string;
  languages?: readonly Exclude<FabCubeLanguage, "english">[];
  githubToken?: string;
  allowUnmatchedCards?: boolean;
}): Promise<readonly LocalizedGenerationSummary[]> {
  const sourceRef = options.sourceRef ?? FAB_CUBE_DEFAULT_REF;
  const languages = options.languages ?? DEFAULT_LOCALIZED_LANGUAGES;
  const generatedDirectory = path.join(options.workspaceRoot, "packages/cards/src/generated");
  const cardDataPath = path.join(generatedDirectory, "flesh-and-blood-card-data.json");
  const cardData = CatalogKeysSchema.parse(JSON.parse(await readFile(cardDataPath, "utf8")));
  const keys = catalogKeyIndex(cardData);
  const assetPrintings = fleshAndBloodAssetPrintingsFromManifest(
    JSON.parse(await readFile(options.assetManifestPath, "utf8")),
  );
  if (!keys.sha256) throw new Error("The English catalog provenance is required for keying.");

  let sourceVersion = options.sourceVersion;
  const summary: LocalizedGenerationSummary[] = [];
  for (const language of languages) {
    const snapshot = await scrapeFabCube({
      sourceRef,
      ...(sourceVersion ? { sourceVersion } : {}),
      language,
      ...(options.githubToken ? { githubToken: options.githubToken } : {}),
    });
    sourceVersion ??= snapshot.sourceVersion;
    const snapshotPath = await writeRawSnapshot(
      snapshot,
      path.join(options.workspaceRoot, ".cache/raw"),
    );
    const extraction = extractLocalizedCatalogData({ snapshot, keys, assetPrintings });
    if (!options.allowUnmatchedCards && extraction.unmatchedCardIds.length > 0) {
      throw new Error(
        `${snapshot.locale} contains ${extraction.unmatchedCardIds.length} card(s) absent from the English catalog: ${extraction.unmatchedCardIds.join(", ")}`,
      );
    }
    const locale = extraction.translations.locale;
    const translationsPath = path.join(
      generatedDirectory,
      `flesh-and-blood-translations-${locale}.json`,
    );
    const printingsPath = path.join(
      generatedDirectory,
      `flesh-and-blood-localized-printings-${locale}.json`,
    );
    if (!extraction.translations.provenance) {
      throw new Error(`Localized translation provenance is missing for ${locale}.`);
    }
    const localizedPrintings: FleshAndBloodLocalizedPrintingsCatalog = {
      schemaVersion: 1,
      game: "flesh-and-blood",
      locale,
      provenance: extraction.translations.provenance,
      catalogSha256: keys.sha256,
      printingsByCanonicalId: sortedPrintingsByCanonicalId(extraction.printingsByCanonicalId),
    };
    await Promise.all([
      writeFile(translationsPath, `${JSON.stringify(extraction.translations, null, 2)}\n`, "utf8"),
      writeFile(printingsPath, `${JSON.stringify(localizedPrintings, null, 2)}\n`, "utf8"),
    ]);
    summary.push({
      language,
      locale,
      sourceVersion: snapshot.sourceVersion,
      snapshotPath: path.relative(options.workspaceRoot, snapshotPath),
      translationsPath: path.relative(options.workspaceRoot, translationsPath),
      printingsPath: path.relative(options.workspaceRoot, printingsPath),
      matchedCards: extraction.matchedCardCount,
      unmatchedCards: extraction.unmatchedCardIds,
      matchedSets: extraction.matchedSetCount,
      unmatchedSets: extraction.unmatchedSetIds,
      printings: Object.values(extraction.printingsByCanonicalId).flat().length,
    });
  }
  return summary;
}
