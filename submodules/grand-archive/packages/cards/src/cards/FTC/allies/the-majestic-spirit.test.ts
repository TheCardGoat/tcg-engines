import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { theMajesticSpirit } from "./the-majestic-spirit.ts";

/** @covers tsvbgl6ffq-a1 */
describe("The Majestic Spirit — printed keywords", () => {
  proveKeywordGroup({
    card: theMajesticSpirit,
    keywords: [
      {
        name: "intercept",
      },
      {
        name: "true-sight",
      },
      {
        name: "vigor",
      },
    ],
  });
});

import { proveGrantedSpellshroud } from "../../../testing/granted-spellshroud.ts";
/** @covers tsvbgl6ffq-a2 */
describe("The Majestic Spirit — champion Spellshroud", () =>
  proveGrantedSpellshroud(theMajesticSpirit, false));

import { proveMajesticPrevention } from "../../../testing/majestic-prevention.ts";
/** @covers tsvbgl6ffq-a3 */
describe("The Majestic Spirit — half damage prevention", () => proveMajesticPrevention());

import { proveMajesticDeparture } from "../../../testing/majestic-prevention.ts";
describe("The Majestic Spirit — repeated prevention and departure", () => proveMajesticDeparture());
