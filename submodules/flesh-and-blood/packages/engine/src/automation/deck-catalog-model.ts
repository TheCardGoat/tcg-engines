/**
 * Shared deck-catalog types and tag helper.
 *
 * Kept separate from `deck-catalog.ts` so fixture modules can import the
 * model without a runtime cycle through the assembled catalog.
 */

export type FabDeckKind = "tournament";

export type FabConstructedFormat = "classic-constructed" | "silver-age";

/** Formats a catalog deck must be legal in. */
export type FabDeckCatalogFormat = FabConstructedFormat;

export type FabHeroClass =
  | "adjudicator"
  | "assassin"
  | "brute"
  | "elemental"
  | "guardian"
  | "illusionist"
  | "lightning"
  | "mechanologist"
  | "merchant"
  | "necromancer"
  | "ninja"
  | "pirate"
  | "ranger"
  | "runeblade"
  | "shapeshifter"
  | "warrior"
  | "wizard";

export type FabDeckOrigin =
  | { readonly kind: "fabrary"; readonly url: string }
  | { readonly kind: "community"; readonly author?: string; readonly date?: string }
  | { readonly kind: "synthetic" };

export interface FabDeckCatalogBase {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly heroName: string;
  readonly heroClass: FabHeroClass;
  readonly origin: FabDeckOrigin;
  readonly event?: string;
  readonly placement?: number;
  readonly tags: readonly string[];
}

export type FabTournamentDeckEntry = FabDeckCatalogBase & {
  readonly kind: "tournament";
  readonly playable: false;
  readonly format: FabConstructedFormat;
  /** Printed hero name; same as {@link FabDeckCatalogBase.heroName}. */
  readonly hero: string;
  /** Raw FaBrary URL when {@link origin} is `fabrary`. */
  readonly source?: string;
  readonly arena: string;
  readonly mainDeck: string;
  readonly cards: string;
};

export type FabDeckCatalogEntry = FabTournamentDeckEntry;

export interface FabDeckCatalogQuery {
  readonly kind?: FabDeckKind;
  readonly format?: FabDeckCatalogFormat;
  readonly playable?: boolean;
  readonly heroClass?: FabHeroClass;
  readonly event?: string;
  readonly tag?: string;
}

/** Deduped tags for fixture constructors. */
export function fabDeckTags(
  ...groups: ReadonlyArray<string | undefined | readonly string[]>
): readonly string[] {
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    const values = group === undefined ? [] : typeof group === "string" ? [group] : group;
    for (const tag of values) {
      if (tag.length === 0 || seen.has(tag)) {
        continue;
      }
      seen.add(tag);
      tags.push(tag);
    }
  }
  return tags;
}
