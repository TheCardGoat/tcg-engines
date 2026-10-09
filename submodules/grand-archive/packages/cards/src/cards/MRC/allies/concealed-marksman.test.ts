import { describe } from "vitest";
import { concealedMarksman } from "./concealed-marksman.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 7fqr67duh1-a2 */
describe("Concealed Marksman Ranged", () => {
  proveRangedAlly({ card: concealedMarksman, power: 1, ranged: 4, classBonus: false });
});

import { proveClassTrueSight } from "../../../testing/class-true-sight.ts";
/** @covers 7fqr67duh1-a1 */
describe("concealedMarksman Class Bonus True Sight", () => proveClassTrueSight(concealedMarksman));
