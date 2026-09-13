import { describe } from "vitest";

import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { airshipEngineer } from "./airship-engineer.ts";
import { proveDistantEntry } from "../../../testing/distant-entry.ts";

/** @covers 66pv4n1n3g-a2 */
describe("Airship Engineer — distant entry condition", () => {
  proveDistantEntry(airshipEngineer, "draw-memory");
});

/** @covers 66pv4n1n3g-a1 */
describe("airship-engineer — Ranged", () => {
  proveRangedAlly({ card: airshipEngineer, power: 1, ranged: 2, classBonus: true });
});
