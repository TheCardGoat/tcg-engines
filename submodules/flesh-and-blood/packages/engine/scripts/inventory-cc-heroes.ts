#!/usr/bin/env node
/**
 * Inventory adult Classic Constructed–legal hero printings vs catalog fixtures.
 */
import { getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { getFabCardCategory } from "@tcg/flesh-and-blood-types";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { FAB_DECK_TEXT_FIXTURES } from "../src/automation/deck-text-fixtures.ts";
import { createFabValidationCard } from "../src/deck-validation-card.ts";

export interface AdultCcHero {
  readonly canonicalId: string;
  readonly name: string;
  readonly slug: string;
  readonly identityTypes: readonly string[];
  readonly types: readonly string[];
}

function isAdultCcLegalHero(canonicalId: string, types: readonly string[]): boolean {
  if (types.includes("Young")) return false;
  const metadata = getFleshAndBloodCard(canonicalId);
  const cc = metadata?.legalities.cc;
  return Boolean(cc?.legal && !cc.banned && !cc.suspended);
}

export function listAdultCcLegalHeroes(): readonly AdultCcHero[] {
  const seen = new Set<string>();
  const heroes: AdultCcHero[] = [];
  for (const card of fleshAndBloodDeckCardLibrary) {
    const typeBox = card.runtime.base.typeBox;
    if (getFabCardCategory(typeBox) !== "hero") continue;
    const validation = createFabValidationCard(card.runtime);
    if (!isAdultCcLegalHero(card.canonicalId, validation.types)) continue;
    if (seen.has(card.canonicalId)) continue;
    seen.add(card.canonicalId);
    heroes.push({
      canonicalId: card.canonicalId,
      name: card.name,
      slug: card.slug,
      identityTypes: validation.identityTypes,
      types: validation.types,
    });
  }
  return heroes.sort((a, b) => a.name.localeCompare(b.name) || a.canonicalId.localeCompare(b.canonicalId));
}

function main(): void {
  const heroes = listAdultCcLegalHeroes();
  const ccFixtures = FAB_DECK_TEXT_FIXTURES.filter((deck) => deck.format === "classic-constructed");
  const covered = new Set(ccFixtures.map((deck) => deck.hero));
  const missing = heroes.filter((hero) => !covered.has(hero.name));
  const extraFixtureHeroes = [...new Set(ccFixtures.map((d) => d.hero))].filter(
    (name) => !heroes.some((hero) => hero.name === name),
  );
  const report = {
    adultCcHeroCount: heroes.length,
    ccFixtureCount: ccFixtures.length,
    coveredHeroCount: heroes.length - missing.length,
    missing,
    extraFixtureHeroes,
    covered: heroes.filter((hero) => covered.has(hero.name)).map((h) => h.name),
  };
  console.log(JSON.stringify(report, null, 2));
}

const isDirect = process.argv[1]?.includes("inventory-cc-heroes");
if (isDirect) main();
