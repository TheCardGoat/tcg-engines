import type { FleshAndBloodCatalogCard } from "@tcg/flesh-and-blood-types/catalog";
import type { FabDoubleFacedCardSpec } from "./authoring/reviewed-card-layouts.ts";

function printingKey(printing: {
  readonly setCode: string;
  readonly collectorNumber: string;
}): string {
  return `${printing.setCode.toUpperCase()}:${printing.collectorNumber.toUpperCase()}`;
}

/**
 * Projects catalog face records onto physical card identities.
 *
 * The upstream catalog stores both faces as canonical records. A back record is
 * not necessarily back-only, however: tokens and equipment such as Gold and
 * Scabskin Leathers also have independent printings. Pairing therefore has to
 * be decided per printing, using the shared set and collector number, rather
 * than by deleting every canonical id ever used as a back face.
 */
export function createCatalogIdentityProjection(
  cards: readonly FleshAndBloodCatalogCard[],
  specs: readonly FabDoubleFacedCardSpec[],
) {
  const cardsByCanonicalId = new Map(cards.map((card) => [card.canonicalId, card] as const));
  const cardsByPrintingId = new Map(
    cards.flatMap((card) => card.printings.map((printing) => [printing.id, card] as const)),
  );
  const cardsBySlug = new Map(
    cards.flatMap((card) => (card.slug ? [[card.slug, card] as const] : [])),
  );
  const backCanonicalIds = new Set(specs.map((spec) => spec.backCanonicalId));
  const frontCanonicalIdByBackPrintingId = new Map<string, string>();

  for (const spec of specs) {
    const front = cardsByCanonicalId.get(spec.frontCanonicalId);
    const back = cardsByCanonicalId.get(spec.backCanonicalId);
    if (!front || !back) continue;

    const frontPrintingKeys = new Set(front.printings.map(printingKey));
    for (const printing of back.printings) {
      if (!frontPrintingKeys.has(printingKey(printing))) continue;
      const existing = frontCanonicalIdByBackPrintingId.get(printing.id);
      if (existing && existing !== spec.frontCanonicalId) {
        throw new Error(
          `Double-faced back printing ${printing.id} maps to both ${existing} and ${spec.frontCanonicalId}.`,
        );
      }
      frontCanonicalIdByBackPrintingId.set(printing.id, spec.frontCanonicalId);
    }
  }

  const independentlyPrintedBackCanonicalIds = new Set(
    cards
      .filter(
        (card) =>
          backCanonicalIds.has(card.canonicalId) &&
          card.printings.some((printing) => !frontCanonicalIdByBackPrintingId.has(printing.id)),
      )
      .map((card) => card.canonicalId),
  );
  const physicalCards = cards.filter(
    (card) =>
      !backCanonicalIds.has(card.canonicalId) ||
      independentlyPrintedBackCanonicalIds.has(card.canonicalId),
  );

  const resolvePhysicalCanonicalId = (id: string): string | undefined => {
    const printingCard = cardsByPrintingId.get(id);
    if (printingCard) {
      return frontCanonicalIdByBackPrintingId.get(id) ?? printingCard.canonicalId;
    }

    const card = cardsByCanonicalId.get(id) ?? cardsBySlug.get(id);
    if (!card) return undefined;
    if (!backCanonicalIds.has(card.canonicalId)) return card.canonicalId;
    return independentlyPrintedBackCanonicalIds.has(card.canonicalId)
      ? card.canonicalId
      : undefined;
  };

  return {
    cardsByCanonicalId,
    cardsByPrintingId,
    cardsBySlug,
    physicalCards,
    independentlyPrintedBackCanonicalIds,
    frontCanonicalIdByBackPrintingId,
    resolvePhysicalCanonicalId,
  } as const;
}
