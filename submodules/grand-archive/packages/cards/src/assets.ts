import type { GrandArchiveCatalog } from "@tcg/grand-archive-types";
import { grandArchiveAssetCatalog } from "./generated/grand-archive-assets.ts";
export {
  grandArchiveAssetCatalog,
  grandArchivePresentationReference,
} from "./generated/grand-archive-assets.ts";

export interface GrandArchiveAppearance {
  boardImageAspectRatio?: number;
  printedImageAspectRatio?: number;
  locale: string;
  artId: string;
  boardImageUrl: string;
  printedImageUrl: string;
}
export interface GrandArchiveAssetRecord {
  canonicalId: string;
  slug: string;
  name: string;
  defaultPrintingId: string;
  boardImageUrl: string;
  printedImageUrl: string;
  imageAspectRatio: number;
  keywords: string[];
  printings: Record<string, GrandArchiveAppearance>;
  faces: Record<string, string>;
}
export interface GrandArchiveAssetCatalog {
  schemaVersion: number;
  game: string;
  snapshotHash: string;
  assetRelease: { schemaVersion: number; revision: string; path: string };
  records: Record<string, GrandArchiveAssetRecord>;
  aliases: Record<string, string>;
}

/** Explicit printing selection never falls back to another printing. */
export function resolveGrandArchiveImage(
  canonicalId: string,
  printingId?: string,
  catalog: Pick<GrandArchiveAssetCatalog, "records"> = grandArchiveAssetCatalog,
): string | undefined {
  const record = catalog.records[canonicalId];
  if (!record) return undefined;
  return record.printings[printingId ?? record.defaultPrintingId]?.printedImageUrl;
}

/** Generated metadata and the pinned asset release must describe the same snapshot. */
export function withGrandArchiveAssets(catalog: GrandArchiveCatalog): GrandArchiveCatalog {
  if (catalog.provenance?.sha256 !== grandArchiveAssetCatalog.snapshotHash)
    throw new Error(
      "Grand Archive asset/catalog snapshot mismatch; stage and export matching assets",
    );
  return {
    ...catalog,
    cards: catalog.cards.map((card) => ({
      ...card,
      printings: card.printings.map((printing) => {
        const imageUrl = resolveGrandArchiveImage(card.canonicalId, printing.id);
        if (!imageUrl)
          throw new Error(`Missing exact Grand Archive printing asset: ${printing.id}`);
        return { ...printing, imageUrl };
      }),
    })),
  };
}
