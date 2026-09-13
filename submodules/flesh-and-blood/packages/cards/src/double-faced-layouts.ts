import type {
  FabCardLayout,
  FabPairedCardFace,
  FleshAndBloodCard,
} from "@tcg/flesh-and-blood-types";
import { typeBoxTokens } from "@tcg/flesh-and-blood-types/authoring";
import { type FabDoubleFacedCardSpec } from "./authoring/reviewed-card-layouts.ts";
import { FAB_DOUBLE_FACED_CARD_SPECS } from "./authoring/reviewed-card-layouts.ts";
import { createCatalogIdentityProjection } from "./catalog-identity-projection.ts";
import { fleshAndBloodCatalog } from "./generated/flesh-and-blood-catalog.ts";

const PRINTED_CARD_BY_CANONICAL_ID = new Map(
  fleshAndBloodCatalog.cards.map((card) => [card.canonicalId, card] as const),
);
const CATALOG_IDENTITY_PROJECTION = createCatalogIdentityProjection(
  fleshAndBloodCatalog.cards,
  FAB_DOUBLE_FACED_CARD_SPECS,
);

/** Converts source-face modules into the one physical-card registry used by a match program. */
export function firstClassDoubleFacedCards(
  cards: Iterable<FleshAndBloodCard>,
): ReadonlyMap<string, FleshAndBloodCard> {
  const byId = new Map([...cards].map((card) => [card.canonicalId, card] as const));
  for (const spec of FAB_DOUBLE_FACED_CARD_SPECS) {
    const front = required(byId, spec.frontCanonicalId, "structured front");
    const back = required(byId, spec.backCanonicalId, "structured back");
    byId.set(spec.frontCanonicalId, {
      ...front,
      layout: layoutFor(spec, front, back),
    });
  }
  for (const backId of FAB_DOUBLE_FACED_CARD_SPECS.map((spec) => spec.backCanonicalId)) {
    if (!CATALOG_IDENTITY_PROJECTION.independentlyPrintedBackCanonicalIds.has(backId)) {
      byId.delete(backId);
    }
  }
  return byId;
}

function layoutFor(
  spec: FabDoubleFacedCardSpec,
  front: FleshAndBloodCard,
  back: FleshAndBloodCard,
): FabCardLayout {
  const authoredLayout =
    front.layout.kind === "flip" ||
    front.layout.kind === "twin" ||
    front.layout.kind === "transcend"
      ? front.layout
      : undefined;
  const faces = {
    front: pairedFace(spec.frontCanonicalId, "front", front, authoredLayout?.front),
    back: pairedFace(spec.frontCanonicalId, "back", back, authoredLayout?.back),
  };
  return spec.kind === "flip"
    ? { kind: "flip", family: spec.family, ...faces }
    : { kind: spec.kind, ...faces };
}

function pairedFace(
  physicalId: string,
  side: "front" | "back",
  card: FleshAndBloodCard,
  authoredFace?: FabPairedCardFace,
): FabPairedCardFace {
  const printed = PRINTED_CARD_BY_CANONICAL_ID.get(card.canonicalId);
  return {
    faceId: `${physicalId}:face:${side}`,
    // Authored modules use stable slugs as their base identity. Faces are
    // player-nameable printed properties, so preserve the source catalog name.
    name: printed?.name ?? card.base.names[0],
    typeText: printed?.typeText ?? typeBoxTokens(card.base.typeBox).join(" "),
    types: authoredFace?.types ?? typeBoxTokens(card.base.typeBox),
    traits: authoredFace?.traits ?? card.base.traits,
    text: printed?.functionalTextPlain ?? authoredFace?.text ?? "",
    keywords: authoredFace?.keywords ?? card.base.keywords,
    // The paired back is a separately localized source card. Prefer that
    // runtime AST over the front module's authored layout snapshot, whose
    // presentation text intentionally remains blank at authoring time.
    abilities:
      side === "back" && card.base.abilities.length > 0
        ? card.base.abilities
        : authoredFace?.abilities.length
          ? authoredFace.abilities
          : card.base.abilities,
    ...(authoredFace?.color
      ? { color: authoredFace.color }
      : card.base.color
        ? { color: card.base.color }
        : {}),
    ...(authoredFace?.numeric
      ? { numeric: authoredFace.numeric }
      : Object.keys(card.base.numeric).length > 0
        ? { numeric: card.base.numeric }
        : {}),
  };
}

function required<Value>(map: ReadonlyMap<string, Value>, id: string, label: string): Value {
  const value = map.get(id);
  if (!value) throw new Error(`Missing ${label} for reviewed double-faced card ${id}.`);
  return value;
}
