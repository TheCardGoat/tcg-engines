/**
 * Adult Classic Constructed–legal hero printings from the shipped card library.
 */
import { getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { getFabCardCategory } from "@tcg/flesh-and-blood-types";
import type { FabHeroClass } from "./deck-catalog-model.ts";
import type { FabDeckCardLibrary } from "./resolve-text-deck.ts";
import { createFabValidationCard } from "../deck-validation-card.ts";

export interface AdultCcHeroPrinting {
  readonly canonicalId: string;
  readonly name: string;
  readonly slug: string;
  readonly identityTypes: readonly string[];
  readonly heroClass: FabHeroClass;
}

const SUPERTYPE_TO_CLASS: Readonly<Record<string, FabHeroClass>> = {
  Adjudicator: "adjudicator",
  Assassin: "assassin",
  Brute: "brute",
  Elemental: "elemental",
  Guardian: "guardian",
  Illusionist: "illusionist",
  Lightning: "lightning",
  Mechanologist: "mechanologist",
  Merchant: "merchant",
  Necromancer: "necromancer",
  Ninja: "ninja",
  Pirate: "pirate",
  Ranger: "ranger",
  Runeblade: "runeblade",
  Shapeshifter: "shapeshifter",
  Warrior: "warrior",
  Wizard: "wizard",
};

const CLASS_PRIORITY: readonly FabHeroClass[] = [
  "pirate",
  "shapeshifter",
  "adjudicator",
  "necromancer",
  "assassin",
  "brute",
  "guardian",
  "illusionist",
  "mechanologist",
  "merchant",
  "ninja",
  "ranger",
  "runeblade",
  "warrior",
  "wizard",
  "lightning",
  "elemental",
];

export function heroClassFromIdentityTypes(identityTypes: readonly string[]): FabHeroClass {
  const mapped = identityTypes
    .map((type) => SUPERTYPE_TO_CLASS[type])
    .filter((value): value is FabHeroClass => value !== undefined);
  for (const preferred of CLASS_PRIORITY) {
    if (mapped.includes(preferred)) return preferred;
  }
  throw new Error(`No FabHeroClass mapping for identity types: ${identityTypes.join(", ")}`);
}

export function isAdultCcLegalHeroPrinting(canonicalId: string, types: readonly string[]): boolean {
  if (types.includes("Young")) return false;
  const metadata = getFleshAndBloodCard(canonicalId);
  const cc = metadata?.legalities.cc;
  return Boolean(cc?.legal && !cc.banned && !cc.suspended);
}

/** Unique adult hero printings the shipped CC validator will accept as the seated hero. */
export function listAdultCcLegalHeroPrintings(
  library: FabDeckCardLibrary,
): readonly AdultCcHeroPrinting[] {
  const seen = new Set<string>();
  const heroes: AdultCcHeroPrinting[] = [];
  for (const card of library) {
    const typeBox = card.runtime.base.typeBox;
    if (getFabCardCategory(typeBox) !== "hero") continue;
    const validation = createFabValidationCard(card.runtime);
    if (!isAdultCcLegalHeroPrinting(card.canonicalId, validation.types)) continue;
    if (seen.has(card.canonicalId)) continue;
    seen.add(card.canonicalId);
    heroes.push({
      canonicalId: card.canonicalId,
      name: card.name,
      slug: card.slug,
      identityTypes: validation.identityTypes,
      heroClass: heroClassFromIdentityTypes(validation.identityTypes),
    });
  }
  return heroes.sort(
    (left, right) =>
      left.name.localeCompare(right.name) || left.canonicalId.localeCompare(right.canonicalId),
  );
}
