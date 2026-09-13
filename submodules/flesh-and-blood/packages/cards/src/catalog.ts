import { FAB_DOUBLE_FACED_CARD_SPECS } from "./authoring/reviewed-card-layouts.ts";
import type { FleshAndBloodCatalogCard } from "@tcg/flesh-and-blood-types/catalog";
import type { FabPublicCardIdentity } from "@tcg/flesh-and-blood-types";
import { fleshAndBloodCatalog } from "./generated/flesh-and-blood-catalog.ts";
import { createCatalogIdentityProjection } from "./catalog-identity-projection.ts";

export const fleshAndBloodCatalogIdentityProjection = createCatalogIdentityProjection(
  fleshAndBloodCatalog.cards,
  FAB_DOUBLE_FACED_CARD_SPECS,
);

export const allFleshAndBloodCards: readonly FleshAndBloodCatalogCard[] =
  fleshAndBloodCatalogIdentityProjection.physicalCards;

/**
 * Every catalog record, including the paired physical printings excluded from
 * gameplay identity lookup. Consumers that only need published metadata (such
 * as card art) must not lose those records.
 */
export const allFleshAndBloodCatalogCards: readonly FleshAndBloodCatalogCard[] =
  fleshAndBloodCatalog.cards;

/** Global public rules catalog. It is independent of every match/deck. */
export const fleshAndBloodPublicCardIdentities: readonly FabPublicCardIdentity[] =
  fleshAndBloodCatalogIdentityProjection.physicalCards
    .map((card) => {
      const pairedBack = FAB_DOUBLE_FACED_CARD_SPECS.find(
        (spec) => spec.frontCanonicalId === card.canonicalId,
      );
      const backName = pairedBack
        ? fleshAndBloodCatalogIdentityProjection.cardsByCanonicalId.get(pairedBack.backCanonicalId)
            ?.name
        : undefined;
      const names = backName
        ? [card.name, backName]
        : card.name.includes(" // ")
          ? card.name.split(" // ").map((name) => name.trim())
          : [card.name];
      const isHero = card.typeText.split(/\s+/).includes("Hero");
      return {
        canonicalId: card.canonicalId,
        names,
        ...(isHero
          ? {
              isHero: true,
              legalInLivingLegend: card.legalities.ll.legal,
            }
          : {}),
      };
    })
    .sort((left, right) => left.canonicalId.localeCompare(right.canonicalId));

export function getFleshAndBloodCard(id: string): FleshAndBloodCatalogCard | undefined {
  return (
    fleshAndBloodCatalogIdentityProjection.cardsByCanonicalId.get(id) ??
    fleshAndBloodCatalogIdentityProjection.cardsByPrintingId.get(id) ??
    fleshAndBloodCatalogIdentityProjection.cardsBySlug.get(id)
  );
}

/** Resolves a catalog id to the physical structured identity a match should load. */
export function getFleshAndBloodPhysicalCanonicalId(id: string): string | undefined {
  return fleshAndBloodCatalogIdentityProjection.resolvePhysicalCanonicalId(id);
}
