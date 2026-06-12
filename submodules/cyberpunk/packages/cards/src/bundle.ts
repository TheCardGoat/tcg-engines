import { DSL_VERSION, type StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { alphaCards } from "./alpha/index.ts";
import { promoCards } from "./promo/index.ts";
import { spoilerCards } from "./spoiler/index.ts";

const structuredCards: StructuredCardDefinition[] = [...alphaCards, ...spoilerCards, ...promoCards];

/**
 * DSL version of every card in {@link cardBundle}. External consumers should
 * pass this to `assertCompatibleDsl()` from `@tcg/cyberpunk-types` to verify
 * their engine can interpret the bundle. See the `DSL_VERSION` JSDoc for the
 * bump policy.
 */
export const BUNDLE_DSL_VERSION: number = DSL_VERSION;

/**
 * Frozen, build-time bundle: every structured card definition keyed by its
 * stable `id`. Use this for production lookups instead of scanning the array.
 */
export const cardBundle: Readonly<Record<string, StructuredCardDefinition>> = Object.freeze(
  Object.fromEntries(structuredCards.map((c) => [c.id, c])),
);

export interface CardCatalog {
  get(definitionId: string): StructuredCardDefinition | undefined;
  entries(): IterableIterator<[string, StructuredCardDefinition]>;
  size: number;
}

/**
 * Construct a {@link CardCatalog} backed by {@link cardBundle}. The catalog is
 * lightweight; create one per session/match. Tests can extend the result by
 * wrapping it or by using the engine's `overrideDefinition` overlay.
 */
export function createCardCatalog(): CardCatalog {
  const entries = Object.entries(cardBundle);
  return {
    get(id) {
      return cardBundle[id];
    },
    *entries() {
      for (const e of entries) yield e as [string, StructuredCardDefinition];
    },
    get size() {
      return entries.length;
    },
  };
}
