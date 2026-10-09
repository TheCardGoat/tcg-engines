import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

import {
  deduplicateRawCardsById,
  fetchCardFaqs,
  formatGeneratedCardsModule,
  normalizeCard,
  preserveStableCardIds,
  refreshCatalogFaqsOnly,
  scrapeCatalog,
  type ScrapedCatalogSnapshot,
} from "./index.ts";

async function main() {
  const faqOnly = process.argv.slice(2).includes("--faqs-only");
  const outputPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../packages/cards/src/generated.ts",
  );
  const existingSnapshot = await readExistingSnapshot(outputPath);
  const snapshot = faqOnly
    ? await refreshFaqsOnly(existingSnapshot)
    : await refreshCatalog(existingSnapshot);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, formatGeneratedCardsModule(snapshot), "utf8");
  execFileSync("vp", ["fmt", outputPath], { stdio: "inherit" });

  console.log(
    `Wrote ${snapshot.rawCards.length} raw cards and ${snapshot.cards.length} normalized cards to ${outputPath}.`,
  );
}

async function refreshFaqsOnly(
  existingSnapshot: ScrapedCatalogSnapshot | null,
): Promise<ScrapedCatalogSnapshot> {
  if (!existingSnapshot) throw new Error("An existing card catalog is required for --faqs-only.");
  return refreshCatalogFaqsOnly(existingSnapshot, await fetchCardFaqs());
}

async function refreshCatalog(
  existingSnapshot: ScrapedCatalogSnapshot | null,
): Promise<ScrapedCatalogSnapshot> {
  const scrapedSnapshot = await scrapeCatalog();
  const mergedSnapshot = existingSnapshot
    ? mergeCatalogSnapshots(existingSnapshot, scrapedSnapshot)
    : scrapedSnapshot;
  const dedupedSnapshot: ScrapedCatalogSnapshot = {
    rawCards: deduplicateRawCardsById(mergedSnapshot.rawCards),
    cards: mergedSnapshot.cards,
  };
  const normalizedSnapshot = normalizeCatalogSnapshot(dedupedSnapshot);
  return existingSnapshot
    ? preserveStableCardIds(normalizedSnapshot, existingSnapshot)
    : normalizedSnapshot;
}

function normalizeCatalogSnapshot(snapshot: ScrapedCatalogSnapshot): ScrapedCatalogSnapshot {
  return {
    rawCards: snapshot.rawCards,
    cards: snapshot.rawCards.map(normalizeCard),
  };
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

function mergeCatalogSnapshots(
  existingSnapshot: ScrapedCatalogSnapshot,
  scrapedSnapshot: ScrapedCatalogSnapshot,
): ScrapedCatalogSnapshot {
  return {
    rawCards: mergeBySetAndSlug(existingSnapshot.rawCards, scrapedSnapshot.rawCards, (card) => {
      return `${card.set.code}:${card.slug}`;
    }),
    cards: mergeBySetAndSlug(existingSnapshot.cards, scrapedSnapshot.cards, (card) => {
      return `${card.set.code}:${card.slug}`;
    }),
  };
}

function mergeBySetAndSlug<T>(
  existingCards: readonly T[],
  scrapedCards: readonly T[],
  readKey: (card: T) => string,
): T[] {
  const cardsByKey = new Map(existingCards.map((card) => [readKey(card), card]));

  for (const card of scrapedCards) {
    cardsByKey.set(readKey(card), card);
  }

  return [...cardsByKey.values()].sort((left, right) => {
    return readKey(left).localeCompare(readKey(right));
  });
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
