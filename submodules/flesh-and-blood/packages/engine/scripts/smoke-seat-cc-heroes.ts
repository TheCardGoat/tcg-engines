#!/usr/bin/env node
/**
 * Seat hero-profile vs value-extract on one validator-clean CC list per adult hero.
 */
import { fleshAndBloodDeckCardLibrary } from "../../cards/src/deck-library.ts";
import { listAdultCcLegalHeroPrintings } from "../src/automation/adult-cc-heroes.ts";
import { playFabMatch } from "../src/automation/bench/play-match.ts";
import { listFabDecks } from "../src/automation/deck-catalog.ts";
import { validateFabDeckTextFixture } from "../src/automation/validate-text-deck.ts";

const library = fleshAndBloodDeckCardLibrary;
const heroes = listAdultCcLegalHeroPrintings(library);
const ccLists = listFabDecks({ format: "classic-constructed" });
const results: Array<{
  hero: string;
  deckId: string;
  termination?: string;
  error?: string;
}> = [];

for (const hero of heroes) {
  const fixture = ccLists.find((deck) => {
    if (deck.hero !== hero.name) return false;
    const result = validateFabDeckTextFixture(library, deck);
    return result.valid && result.unresolved.length === 0;
  });
  if (!fixture) {
    results.push({ hero: hero.name, deckId: "", error: "no validator-clean CC list" });
    continue;
  }
  try {
    const played = playFabMatch({
      cardLibrary: library,
      seed: `cc-seat-${fixture.id}`,
      p1Strategy: "hero-profile",
      p2Strategy: "value-extract",
      p1Deck: fixture.id,
      p2Deck: "cc-guilherme-coutinho-rhinar",
      maxActions: 24,
      recordFrames: false,
      snapshotValidation: false,
    });
    results.push({
      hero: hero.name,
      deckId: fixture.id,
      termination: played.termination,
    });
    console.error(`ok ${hero.name} ${fixture.id} ${played.termination} actions=${played.actionCount}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ hero: hero.name, deckId: fixture.id, error: message });
    console.error(`FAIL ${hero.name} ${fixture.id}: ${message}`);
  }
}

const failures = results.filter((row) => row.error);
console.log(JSON.stringify({ seated: results.length, failures: failures.length, results }, null, 2));
if (failures.length) process.exitCode = 1;
