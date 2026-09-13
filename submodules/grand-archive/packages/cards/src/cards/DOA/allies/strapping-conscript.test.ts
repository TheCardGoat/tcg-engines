import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";
import { describe } from "vitest";
import { strappingConscript } from "./strapping-conscript.ts";

/** @covers csMiEObm2l-a1 */
describe("Strapping Conscript \u2014 resolution", () => {
  proveAllyCombatStats({
    card: strappingConscript,
    power: 2,
    life: 1,
    classBonus: false,
    level: 2,
  });
});

describe("other condition boundaries", () => {
  proveAllyCombatStats({ card: strappingConscript, power: 2, life: 1, classBonus: true, level: 1 });
  proveAllyCombatStats({ card: strappingConscript, power: 3, life: 2, classBonus: true, level: 2 });
});
