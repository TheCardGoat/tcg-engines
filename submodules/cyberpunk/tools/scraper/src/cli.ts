import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

import {
  formatGeneratedCardsModule,
  preserveStableCardIds,
  scrapeCatalog,
  type ScrapedCatalogSnapshot,
} from "./index.ts";

async function main() {
  const outputPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../packages/cards/src/generated.ts",
  );
  const existingSnapshot = await readExistingSnapshot(outputPath);
  const scrapedSnapshot = await scrapeCatalog();
  const snapshot = existingSnapshot
    ? preserveStableCardIds(scrapedSnapshot, existingSnapshot)
    : scrapedSnapshot;

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, formatGeneratedCardsModule(snapshot), "utf8");

  console.log(
    `Wrote ${snapshot.rawCards.length} raw cards and ${snapshot.cards.length} normalized cards to ${outputPath}.`,
  );
}

async function readExistingSnapshot(outputPath: string): Promise<ScrapedCatalogSnapshot | null> {
  try {
    const moduleUrl = `${pathToFileURL(outputPath).href}?stableIds=${Date.now()}`;
    const namespace = (await import(moduleUrl)) as Partial<ScrapedCatalogSnapshot>;

    if (!Array.isArray(namespace.rawCards) || !Array.isArray(namespace.cards)) {
      return null;
    }

    return {
      rawCards: namespace.rawCards,
      cards: namespace.cards,
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
