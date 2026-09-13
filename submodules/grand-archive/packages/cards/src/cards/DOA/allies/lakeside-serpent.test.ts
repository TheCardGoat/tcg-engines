import { giveBath } from "../actions/give-bath.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";
import { describe } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { lakesideSerpent } from "./lakeside-serpent.ts";

/** @covers krgjMyVHRd-a1 */
describe("Lakeside Serpent \u2014 krgjMyVHRd-a1", () => {
  provePrideAlly({ card: lakesideSerpent, pride: 6, power: 3 });
});

/** @covers krgjMyVHRd-a2 */
describe("Lakeside Serpent \u2014 resolution", () => {
  proveAllyCombatStats({ card: lakesideSerpent, power: 3, life: 5, level: 6, classBonus: true });
});

describe("Water graveyard count and class boundaries", () => {
  proveAllyCombatStats({
    card: lakesideSerpent,
    power: 4,
    life: 5,
    level: 6,
    classBonus: true,
    graveyard: [giveBath, woodlandSquirrels],
  });
  proveAllyCombatStats({
    card: lakesideSerpent,
    power: 5,
    life: 5,
    level: 6,
    classBonus: true,
    graveyard: [giveBath, giveBath, woodlandSquirrels],
  });
  proveAllyCombatStats({
    card: lakesideSerpent,
    power: 3,
    life: 5,
    level: 6,
    classBonus: false,
    graveyard: [giveBath, woodlandSquirrels],
  });
  proveAllyCombatStats({
    card: lakesideSerpent,
    power: 3,
    life: 5,
    level: 6,
    classBonus: false,
    graveyard: [giveBath, giveBath, woodlandSquirrels],
  });
});
