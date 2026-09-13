import type {
  FleshAndBloodCatalog,
  FleshAndBloodTranslationCatalog,
} from "@tcg/flesh-and-blood-types";

import { localeAssetUrlsForCard } from "./authoring/locale-assets.ts";

/** The source catalog already owns the default locale's display text and assets. */
export function defaultTranslationsFromCatalog(
  catalog: FleshAndBloodCatalog,
): FleshAndBloodTranslationCatalog {
  const locale = catalog.provenance?.locale ?? "en-US";
  return {
    schemaVersion: 1,
    game: "flesh-and-blood",
    locale,
    provenance: catalog.provenance,
    catalogSha256: catalog.provenance?.sha256 ?? "",
    sets: catalog.sets.map((set) => ({ setId: set.id, name: set.name })),
    cards: catalog.cards.map((card) => {
      const assets = localeAssetUrlsForCard(card.printings ?? [], locale);
      return {
        canonicalId: card.canonicalId,
        name: card.name,
        ...(card.functionalTextHtml ? { functionalTextHtml: card.functionalTextHtml } : {}),
        ...(card.functionalTextPlain ? { functionalTextPlain: card.functionalTextPlain } : {}),
        ...(card.typeText ? { typeText: card.typeText } : {}),
        ...(assets ? { imageUrl: assets.imageUrl, boardImageUrl: assets.boardImageUrl } : {}),
      };
    }),
  };
}
