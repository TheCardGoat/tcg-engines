#!/usr/bin/env node
/**
 * Build validator-clean Classic Constructed lists for adult heroes that lack
 * a catalog fixture. Writes `src/automation/deck-text-fixtures-cc-coverage.ts`.
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { listAdultCcLegalHeroPrintings } from "../src/automation/adult-cc-heroes.ts";
import { FAB_DECK_TEXT_FIXTURES } from "../src/automation/deck-text-fixtures.ts";
import { createFabTournamentTextFixture } from "../src/automation/deck-text-fixture-factory.ts";
import { validateFabDeckTextFixture } from "../src/automation/validate-text-deck.ts";
import type { FabHeroClass } from "../src/automation/deck-catalog-model.ts";
import {
  parseFabDeckTextLine,
  resolveCatalogCardByName,
  type FabDeckCardRecord,
} from "../src/automation/resolve-text-deck.ts";
import { createFabValidationCard } from "../src/deck-validation-card.ts";
import {
  fabCardCopyLimit,
  fabCardPoolIssues,
  fabEquipmentSlots,
  validateFabDeckConstruction,
  validateWeaponArea,
  fabWeaponAreaEntry,
  type FabEquipmentSlot,
  type FabValidationCard,
} from "../src/deck-validation.ts";

const PITCH_LABEL: Readonly<Record<string, "red" | "yellow" | "blue">> = {
  "1": "red",
  "2": "yellow",
  "3": "blue",
};

interface IndexedCard {
  readonly record: FabDeckCardRecord;
  readonly validation: FabValidationCard;
}

function validationCard(record: FabDeckCardRecord): FabValidationCard | undefined {
  const metadata = getFleshAndBloodCard(record.canonicalId);
  if (!metadata) return undefined;
  return createFabValidationCard(record.runtime, metadata);
}

function indexLibrary(): readonly IndexedCard[] {
  const indexed: IndexedCard[] = [];
  for (const record of fleshAndBloodDeckCardLibrary) {
    const validation = validationCard(record);
    if (!validation) continue;
    indexed.push({ record, validation });
  }
  return indexed;
}

function legalForHero(card: IndexedCard, hero: FabValidationCard): boolean {
  if (!card.validation.legalFormats.includes("cc")) return false;
  if (card.validation.cardCategory !== "deck" && card.validation.cardCategory !== "arena") {
    return false;
  }
  return fabCardPoolIssues(card.validation, hero, "cc").length === 0;
}

function scoreDeckCard(card: IndexedCard): number {
  const types = card.validation.types;
  let score = 0;
  if (types.includes("Attack")) score += 100;
  if (types.includes("Instant")) score += 25;
  if (types.includes("Attack Reaction")) score += 20;
  if (types.includes("Defense Reaction")) score += 18;
  if (types.includes("Block")) score += 8;
  if (types.includes("Resource")) score += 6;
  if (card.validation.pitch === "3") score += 12;
  if (card.validation.pitch === "1") score += 4;
  const cost = card.record.runtime.base.numeric.cost;
  if (cost === 0) score += 10;
  else if (cost === 1) score += 8;
  else if (cost === 2) score += 5;
  else if (cost !== undefined && cost >= 4) score -= 4;
  return score;
}

function displayLine(card: IndexedCard, count: number): string {
  const pitch = card.validation.pitch ? PITCH_LABEL[card.validation.pitch] : undefined;
  return pitch ? `${count}x ${card.record.name} (${pitch})` : `${count}x ${card.record.name}`;
}

function pickSlot(
  cards: readonly IndexedCard[],
  slot: FabEquipmentSlot,
  used: Set<string>,
): IndexedCard | undefined {
  return cards.find((card) => {
    if (used.has(card.validation.canonicalId)) return false;
    return fabEquipmentSlots(card.validation).includes(slot);
  });
}

function pickArena(hero: FabValidationCard, pool: readonly IndexedCard[]): IndexedCard[] {
  const arena = pool.filter((card) => card.validation.cardCategory === "arena");
  const used = new Set<string>();
  const picked: IndexedCard[] = [];
  const take = (card: IndexedCard | undefined) => {
    if (!card || used.has(card.validation.canonicalId)) return;
    used.add(card.validation.canonicalId);
    picked.push(card);
  };

  const ranger = hero.identityTypes.includes("Ranger");
  const bows = arena.filter(
    (card) => card.validation.types.includes("Bow") && card.validation.types.includes("2H"),
  );
  const quivers = arena.filter((card) => card.validation.types.includes("Quiver"));
  const twoHanders = arena.filter(
    (card) => card.validation.types.includes("Weapon") && card.validation.types.includes("2H"),
  );
  const oneHanders = arena.filter(
    (card) => card.validation.types.includes("Weapon") && card.validation.types.includes("1H"),
  );
  const offHands = arena.filter((card) => card.validation.types.includes("Off-Hand"));

  if (ranger && bows[0] && quivers[0]) {
    take(bows[0]);
    take(quivers[0]);
  } else if (twoHanders[0]) {
    take(twoHanders[0]);
  } else if (oneHanders[0]) {
    take(oneHanders[0]);
    take(offHands[0]);
  }

  for (const slot of ["head", "chest", "arms", "legs"] as const) {
    take(pickSlot(arena, slot, used));
  }

  // One entry per equipped card. A 2H weapon occupies both seats in layout
  // but is still a single area entry — mapping it twice falsely trips
  // two-hander-must-be-alone and the old strip dropped the only weapon.
  const equipped = picked
    .filter((card) =>
      fabEquipmentSlots(card.validation).some((slot) => slot === "weapon1" || slot === "weapon2"),
    )
    .map((card) => fabWeaponAreaEntry(card.validation, hero));
  if (validateWeaponArea(equipped).length > 0) {
    const withoutOffHand = picked.filter(
      (card) => !card.validation.types.includes("Off-Hand") && !card.validation.types.includes("Quiver"),
    );
    const retry = withoutOffHand
      .filter((card) =>
        fabEquipmentSlots(card.validation).some((slot) => slot === "weapon1" || slot === "weapon2"),
      )
      .map((card) => fabWeaponAreaEntry(card.validation, hero));
    if (validateWeaponArea(retry).length === 0) return withoutOffHand;
  }
  return picked;
}

function pickMainDeck(pool: readonly IndexedCard[]): IndexedCard[] | { hole: string } {
  const deckCards = pool
    .filter((card) => card.validation.cardCategory === "deck")
    .slice()
    .sort((left, right) => {
      const delta = scoreDeckCard(right) - scoreDeckCard(left);
      if (delta !== 0) return delta;
      return left.record.name.localeCompare(right.record.name);
    });
  const chosen: IndexedCard[] = [];
  const used = new Set<string>();
  let total = 0;
  const add = (card: IndexedCard, want: number): number => {
    if (used.has(card.validation.canonicalId)) return 0;
    const limit = fabCardCopyLimit(card.validation, "cc");
    const copies = Math.min(want, limit, 60 - total);
    if (copies <= 0) return 0;
    used.add(card.validation.canonicalId);
    for (let i = 0; i < copies; i += 1) chosen.push(card);
    total += copies;
    return copies;
  };
  const fillFrom = (cards: readonly IndexedCard[], targetTotal: number) => {
    for (const card of cards) {
      if (total >= targetTotal || total >= 60) return;
      add(card, 3);
    }
  };

  fillFrom(
    deckCards.filter((card) => card.validation.pitch === "1"),
    21,
  );
  fillFrom(
    deckCards.filter((card) => card.validation.pitch === "2"),
    42,
  );
  fillFrom(
    deckCards.filter((card) => card.validation.pitch === "3"),
    60,
  );
  fillFrom(deckCards, 60);
  if (total < 60) {
    return { hole: `only ${total} legal deck cards` };
  }
  return chosen.slice(0, 60);
}

function countLines(cards: readonly IndexedCard[]): string {
  const groups = new Map<string, { card: IndexedCard; count: number }>();
  for (const card of cards) {
    const key = card.validation.canonicalId;
    const existing = groups.get(key);
    if (existing) existing.count += 1;
    else groups.set(key, { card, count: 1 });
  }
  return [...groups.values()]
    .sort((left, right) => left.card.record.name.localeCompare(right.card.record.name))
    .map(({ card, count }) => displayLine(card, count))
    .join("\n");
}

function validateList(
  hero: IndexedCard,
  arena: readonly IndexedCard[],
  deck: readonly IndexedCard[],
): readonly string[] {
  const entries = [...arena, ...deck].reduce<Array<{ canonicalId: string; quantity: number }>>(
    (acc, card) => {
      const existing = acc.find((entry) => entry.canonicalId === card.validation.canonicalId);
      if (existing) existing.quantity += 1;
      else acc.push({ canonicalId: card.validation.canonicalId, quantity: 1 });
      return acc;
    },
    [],
  );
  const cards: Record<string, FabValidationCard> = {
    [hero.validation.canonicalId]: hero.validation,
  };
  for (const card of [...arena, ...deck]) {
    cards[card.validation.canonicalId] = card.validation;
  }
  const registered = validateFabDeckConstruction({
    mode: "registered",
    format: "cc",
    heroId: hero.validation.canonicalId,
    entries,
    cards,
  });
  return registered.valid ? [] : registered.issues.map((issue) => `${issue.code}: ${issue.message}`);
}

function resolveCheck(heroName: string, arena: string, mainDeck: string): readonly string[] {
  const unresolved: string[] = [];
  if (!resolveCatalogCardByName(fleshAndBloodDeckCardLibrary, heroName)) {
    unresolved.push(heroName);
  }
  for (const blob of [arena, mainDeck]) {
    for (const line of blob.split("\n")) {
      const parsed = parseFabDeckTextLine(line);
      if (!parsed) continue;
      if (!resolveCatalogCardByName(fleshAndBloodDeckCardLibrary, parsed.name, parsed.pitch)) {
        unresolved.push(parsed.pitch ? `${parsed.name} (${parsed.pitch})` : parsed.name);
      }
    }
  }
  return unresolved;
}

function tsIdent(slug: string): string {
  const cleaned = slug.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `CC_COVERAGE_${cleaned.toUpperCase()}`;
}

function main(): void {
  const library = indexLibrary();
  const heroes = listAdultCcLegalHeroPrintings(fleshAndBloodDeckCardLibrary);
  const authoredCc = FAB_DECK_TEXT_FIXTURES.filter(
    (deck) => deck.format === "classic-constructed" && !deck.tags.includes("cc-coverage"),
  );
  const heroesWithValidAuthoredList = new Set(
    authoredCc
      .filter((deck) => validateFabDeckTextFixture(fleshAndBloodDeckCardLibrary, deck).valid)
      .map((deck) => deck.hero),
  );
  const missing = heroes.filter((hero) => !heroesWithValidAuthoredList.has(hero.name));
  const constants: string[] = [];
  const exportNames: string[] = [];
  const holes: Array<{ hero: string; reason: string }> = [];

  for (const printing of missing) {
    const hero = library.find((card) => card.validation.canonicalId === printing.canonicalId);
    if (!hero) {
      holes.push({ hero: printing.name, reason: "hero missing from validation index" });
      continue;
    }
    const pool = library.filter((card) => legalForHero(card, hero.validation));
    const arenaCards = pickArena(hero.validation, pool);
    const deckOrHole = pickMainDeck(pool);
    if ("hole" in deckOrHole) {
      holes.push({ hero: printing.name, reason: deckOrHole.hole });
      continue;
    }
    const issues = validateList(hero, arenaCards, deckOrHole);
    if (issues.length) {
      holes.push({ hero: printing.name, reason: issues.join("; ") });
      continue;
    }
    const arena = countLines(arenaCards);
    const mainDeck = countLines(deckOrHole);
    const unresolved = resolveCheck(printing.name, arena, mainDeck);
    if (unresolved.length) {
      holes.push({ hero: printing.name, reason: `unresolved: ${unresolved.join(", ")}` });
      continue;
    }
    const ident = tsIdent(printing.slug);
    exportNames.push(ident);
    const fixture = createFabTournamentTextFixture({
      id: `cc-coverage-${printing.slug}`,
      name: `CC coverage — ${printing.name}`,
      description: `Validator-built Classic Constructed list for ${printing.name}.`,
      format: "classic-constructed",
      hero: printing.name,
      heroClass: printing.heroClass as FabHeroClass,
      author: "cc-coverage-generator",
      tags: ["cc-coverage"],
      arena,
      mainDeck,
    });
    void fixture;
    constants.push(`export const ${ident} = createFabTournamentTextFixture({
  id: ${JSON.stringify(`cc-coverage-${printing.slug}`)},
  name: ${JSON.stringify(`CC coverage — ${printing.name}`)},
  description: ${JSON.stringify(`Validator-built Classic Constructed list for ${printing.name}.`)},
  format: "classic-constructed",
  hero: ${JSON.stringify(printing.name)},
  heroClass: ${JSON.stringify(printing.heroClass)},
  author: "cc-coverage-generator",
  tags: ["cc-coverage"],
  arena: ${JSON.stringify(arena)},
  mainDeck: ${JSON.stringify(mainDeck)},
});`);
  }

  const outPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../src/automation/deck-text-fixtures-cc-coverage.ts",
  );
  const banner = `/**
 * Validator-built Classic Constructed lists for adult heroes that lacked a
 * catalog fixture. Generated by scripts/generate-cc-coverage-decks.ts.
 * Do not hand-edit card lines; regenerate after catalog changes.
 */

import { createFabTournamentTextFixture } from "./deck-text-fixture-factory.ts";

${constants.join("\n\n")}

export const FAB_CC_COVERAGE_DECK_FIXTURES = [
  ${exportNames.join(",\n  ")},
] as const;
`;
  writeFileSync(outPath, `${banner}\n`);
  console.log(
    JSON.stringify(
      {
        generated: exportNames.length,
        holes,
        outPath,
      },
      null,
      2,
    ),
  );
  if (holes.length) process.exitCode = 1;
}

main();
