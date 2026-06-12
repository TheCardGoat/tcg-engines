import type { CardDefinition, RawCardRecord, StructuredCardDefinition } from "@tcg/cyberpunk-types";

export { cards, rawCards } from "./generated.ts";
export { deckLists } from "./decks/index.ts";
export * from "./alpha/index.ts";
export * from "./spoiler/index.ts";
export * from "./promo/index.ts";
export * from "./boxtoppersretail/index.ts";
export * from "./theheistretailstarterdeck/index.ts";
export * from "./welcometonightcityretail/index.ts";

import { cards, rawCards } from "./generated.ts";
import { alphaCards } from "./alpha/index.ts";
import { boxToppersRetailCards } from "./boxtoppersretail/index.ts";
import { promoCards } from "./promo/index.ts";
import { spoilerCards } from "./spoiler/index.ts";
import { theHeistRetailStarterDeckCards } from "./theheistretailstarterdeck/index.ts";
import { welcomeToNightCityRetailCards } from "./welcometonightcityretail/index.ts";

export function getCardBySlug(slug: string): CardDefinition | undefined {
  return cards.find((card) => card.slug === slug);
}

export function getRawCardBySlug(slug: string): RawCardRecord | undefined {
  return rawCards.find((card) => card.slug === slug);
}

export const structuredCards = [
  ...alphaCards,
  ...spoilerCards,
  ...promoCards,
  ...boxToppersRetailCards,
  ...theHeistRetailStarterDeckCards,
  ...welcomeToNightCityRetailCards,
] satisfies StructuredCardDefinition[];

export function getStructuredCardBySlug(slug: string): StructuredCardDefinition | undefined {
  return structuredCards.find((card) => card.slug === slug);
}

export function getStructuredAlphaCardBySlug(slug: string) {
  return alphaCards.find((card) => card.slug === slug);
}

export function getStructuredSpoilerCardBySlug(slug: string) {
  return spoilerCards.find((card) => card.slug === slug);
}

export function getStructuredPromoCardBySlug(slug: string) {
  return promoCards.find((card) => card.slug === slug);
}

export { cardBundle, createCardCatalog, type CardCatalog, BUNDLE_DSL_VERSION } from "./bundle.ts";
export {
  CYBERPUNK_CARDS_RUNTIME,
  type CyberpunkCardsRuntimeFingerprint,
} from "./runtime-fingerprint.ts";

// Re-export the version contract from `@tcg/cyberpunk-types` for convenience —
// external consumers can do everything they need with one import:
//   import { cardBundle, BUNDLE_DSL_VERSION, assertCompatibleDsl } from "@tcg/cyberpunk-cards";
//   assertCompatibleDsl(BUNDLE_DSL_VERSION);
export { DSL_VERSION, MIN_SUPPORTED_DSL_VERSION, assertCompatibleDsl } from "@tcg/cyberpunk-types";

// Authoring helpers — derive `timingTriggers` / `keywords` from the abilities
// array, plus the canonical gear attachment literal. See
// `packages/cards/src/define.ts` for the implementations.
export {
  deriveCardSurface,
  deriveKeywords,
  deriveTimingTriggers,
  gearAttachmentToUnitOrLegend,
} from "./define.ts";

// Builder helpers — fluent / factory API for authoring abilities, targets,
// conditions, and effects without hand-writing the discriminated-union JSON.
export {
  AbilityBuilder,
  KeywordAbilityBuilder,
  StaticAbilityBuilder,
  TriggeredAbilityBuilder,
  condition,
  effect,
  target,
} from "./helpers/builders/index.ts";
