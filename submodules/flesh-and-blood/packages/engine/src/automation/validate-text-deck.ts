/**
 * Run the shipped CC/Silver Age construction validator against a text fixture.
 */
import { getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import type { FabDeckTextFixture } from "./deck-text-fixture-factory.ts";
import {
  parseFabDeckTextLine,
  resolveCatalogCardByName,
  type FabDeckCardLibrary,
  type FabDeckCardRecord,
} from "./resolve-text-deck.ts";
import { createFabValidationCard } from "../deck-validation-card.ts";
import {
  validateFabDeckConstruction,
  type FabValidationCard,
  type FabValidationIssue,
} from "../deck-validation.ts";

export interface FabDeckTextFixtureValidation {
  readonly unresolved: readonly string[];
  readonly valid: boolean;
  readonly issues: readonly FabValidationIssue[];
}

function addEntry(
  entries: Array<{ canonicalId: string; quantity: number }>,
  canonicalId: string,
  quantity: number,
): void {
  const existing = entries.find((entry) => entry.canonicalId === canonicalId);
  if (existing) existing.quantity += quantity;
  else entries.push({ canonicalId, quantity });
}

function validationFor(
  record: FabDeckCardRecord,
): { card: FabValidationCard } | { unresolved: string } {
  const metadata = getFleshAndBloodCard(record.canonicalId);
  if (!metadata) return { unresolved: record.name };
  return { card: createFabValidationCard(record.runtime, metadata) };
}

/** Resolve every named line, then ask {@link validateFabDeckConstruction}. */
export function validateFabDeckTextFixture(
  library: FabDeckCardLibrary,
  fixture: FabDeckTextFixture,
): FabDeckTextFixtureValidation {
  const unresolved: string[] = [];
  const cards: Record<string, FabValidationCard> = {};
  const entries: Array<{ canonicalId: string; quantity: number }> = [];

  const heroRecord = resolveCatalogCardByName(library, fixture.hero);
  if (!heroRecord) {
    unresolved.push(fixture.hero);
  } else {
    const hero = validationFor(heroRecord);
    if ("unresolved" in hero) unresolved.push(hero.unresolved);
    else cards[hero.card.canonicalId] = hero.card;
  }

  for (const blob of [fixture.arena, fixture.mainDeck]) {
    for (const line of blob.split("\n")) {
      const parsed = parseFabDeckTextLine(line);
      if (!parsed) continue;
      const label = parsed.pitch ? `${parsed.name} (${parsed.pitch})` : parsed.name;
      const record = resolveCatalogCardByName(library, parsed.name, parsed.pitch);
      if (!record) {
        unresolved.push(label);
        continue;
      }
      const validated = validationFor(record);
      if ("unresolved" in validated) {
        unresolved.push(validated.unresolved);
        continue;
      }
      cards[validated.card.canonicalId] = validated.card;
      addEntry(entries, validated.card.canonicalId, parsed.count);
    }
  }

  const heroId = heroRecord?.canonicalId ?? null;
  const format = fixture.format === "classic-constructed" ? "cc" : "silverAge";
  const result = validateFabDeckConstruction({
    mode: "registered",
    format,
    heroId,
    entries,
    cards,
  });
  return {
    unresolved,
    valid: unresolved.length === 0 && result.valid,
    issues: result.issues,
  };
}
