import type { Card } from "@tcg/gundam-types";
import type { DeckList } from "@tcg/gundam-engine";
import * as GundamCards from "@tcg/gundam-cards";

import { earthFederationStarter } from "./earth-federation-starter.ts";
import { seedAggro } from "./seed-aggro.ts";
import { gd01Mixed } from "./gd01-mixed.ts";

import { coverageGD01001ToGD01126 } from "./coverage-gd01-001-to-gd01-126.ts";
import { coverageGD01031ToGD01130 } from "./coverage-gd01-031-to-gd01-130.ts";
import { coverageGD01061ToGD02124 } from "./coverage-gd01-061-to-gd02-124.ts";
import { coverageGD02005ToGD02128 } from "./coverage-gd02-005-to-gd02-128.ts";
import { coverageGD02035ToGD03124 } from "./coverage-gd02-035-to-gd03-124.ts";
import { coverageGD02064ToGD03128 } from "./coverage-gd02-064-to-gd03-128.ts";
import { coverageGD03009ToGD03132 } from "./coverage-gd03-009-to-gd03-132.ts";
import { coverageGD03038ToGD04124 } from "./coverage-gd03-038-to-gd04-124.ts";
import { coverageGD03067ToGD04128 } from "./coverage-gd03-067-to-gd04-128.ts";
import { coverageGD04013ToST01016 } from "./coverage-gd04-013-to-st01-016.ts";
import { coverageGD04042ToST03016 } from "./coverage-gd04-042-to-st03-016.ts";
import { coverageGD04071ToST05015 } from "./coverage-gd04-071-to-st05-015.ts";
import { coverageST03002ToST07015 } from "./coverage-st03-002-to-st07-015.ts";
import { coverageST06004ToST09010 } from "./coverage-st06-004-to-st09-010.ts";

/**
 * Stable, URL-safe keys for each built-in sample deck. Selection UI
 * round-trips these through the query string, so renaming them is a
 * breaking change for any shared match links.
 */
export type SampleDeckId =
  | "ef-starter"
  | "seed-aggro"
  | "gd01-mixed"
  | "coverage-gd01-001-to-gd01-126"
  | "coverage-gd01-031-to-gd01-130"
  | "coverage-gd01-061-to-gd02-124"
  | "coverage-gd02-005-to-gd02-128"
  | "coverage-gd02-035-to-gd03-124"
  | "coverage-gd02-064-to-gd03-128"
  | "coverage-gd03-009-to-gd03-132"
  | "coverage-gd03-038-to-gd04-124"
  | "coverage-gd03-067-to-gd04-128"
  | "coverage-gd04-013-to-st01-016"
  | "coverage-gd04-042-to-st03-016"
  | "coverage-gd04-071-to-st05-015"
  | "coverage-st03-002-to-st07-015"
  | "coverage-st06-004-to-st09-010";

export const SAMPLE_DECKS: Readonly<Record<SampleDeckId, DeckList>> = {
  "ef-starter": earthFederationStarter,
  "seed-aggro": seedAggro,
  "gd01-mixed": gd01Mixed,
  "coverage-gd01-001-to-gd01-126": coverageGD01001ToGD01126,
  "coverage-gd01-031-to-gd01-130": coverageGD01031ToGD01130,
  "coverage-gd01-061-to-gd02-124": coverageGD01061ToGD02124,
  "coverage-gd02-005-to-gd02-128": coverageGD02005ToGD02128,
  "coverage-gd02-035-to-gd03-124": coverageGD02035ToGD03124,
  "coverage-gd02-064-to-gd03-128": coverageGD02064ToGD03128,
  "coverage-gd03-009-to-gd03-132": coverageGD03009ToGD03132,
  "coverage-gd03-038-to-gd04-124": coverageGD03038ToGD04124,
  "coverage-gd03-067-to-gd04-128": coverageGD03067ToGD04128,
  "coverage-gd04-013-to-st01-016": coverageGD04013ToST01016,
  "coverage-gd04-042-to-st03-016": coverageGD04042ToST03016,
  "coverage-gd04-071-to-st05-015": coverageGD04071ToST05015,
  "coverage-st03-002-to-st07-015": coverageST03002ToST07015,
  "coverage-st06-004-to-st09-010": coverageST06004ToST09010,
};

export const DEFAULT_DECK_ID: SampleDeckId = "ef-starter";

export const SAMPLE_DECK_IDS = Object.keys(SAMPLE_DECKS) as readonly SampleDeckId[];

export {
  earthFederationStarter,
  seedAggro,
  gd01Mixed,
  coverageGD01001ToGD01126,
  coverageGD01031ToGD01130,
  coverageGD01061ToGD02124,
  coverageGD02005ToGD02128,
  coverageGD02035ToGD03124,
  coverageGD02064ToGD03128,
  coverageGD03009ToGD03132,
  coverageGD03038ToGD04124,
  coverageGD03067ToGD04128,
  coverageGD04013ToST01016,
  coverageGD04042ToST03016,
  coverageGD04071ToST05015,
  coverageST03002ToST07015,
  coverageST06004ToST09010,
};

/**
 * Builds a `Record<cardNumber, Card>` from every card exported by
 * `@tcg/gundam-cards`. Safe to call at module load: each invocation
 * walks the namespace once. Callers that need the catalog for
 * validation or deck expansion should cache the result.
 *
 * Card identity is by `cardNumber`. Reprints with distinct numbers
 * (e.g. `"R-001"`, `"R-001-p3"`) each get their own catalog entry,
 * which is what decklists reference.
 */
export function buildGundamCardCatalog(): Record<string, Card> {
  const catalog: Record<string, Card> = {};
  for (const value of Object.values(GundamCards)) {
    if (
      value &&
      typeof value === "object" &&
      "cardNumber" in value &&
      typeof (value as { cardNumber: unknown }).cardNumber === "string"
    ) {
      const card = value as Card;
      catalog[card.cardNumber] = card;
    }
  }
  return catalog;
}
