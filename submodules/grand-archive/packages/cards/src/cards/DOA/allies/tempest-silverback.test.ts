import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";
import { describe } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { tempestSilverback } from "./tempest-silverback.ts";

/** @covers HWFWO0TB8l-a1 */
describe("Tempest Silverback \u2014 HWFWO0TB8l-a1", () => {
  provePrideAlly({ card: tempestSilverback, pride: 5, power: 4 });
});

/** @covers HWFWO0TB8l-a2 */
describe("Tempest Silverback \u2014 resolution", () => {
  proveAllyCombatStats({ card: tempestSilverback, power: 4, life: 4, classBonus: false, level: 5 });
});

describe("other condition boundaries", () => {
  proveAllyCombatStats({ card: tempestSilverback, power: 6, life: 6, classBonus: true, level: 5 });
});
