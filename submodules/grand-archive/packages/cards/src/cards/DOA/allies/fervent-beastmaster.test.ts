import { grayWolf } from "./gray-wolf.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";
import { proveClassBonusVigor } from "../../../testing/class-bonus-vigor.ts";
import { describe } from "vitest";
import { ferventBeastmaster } from "./fervent-beastmaster.ts";

/** @covers 7NMFSRR5V3-a1 */
describe("Fervent Beastmaster \u2014 resolution", () => {
  proveClassBonusVigor(ferventBeastmaster);
});

/** @covers 7NMFSRR5V3-a2 */
describe("Fervent Beastmaster \u2014 resolution", () => {
  proveAllyCombatStats({ card: ferventBeastmaster, power: 3, life: 3 });
});

describe("other condition boundaries", () => {
  proveAllyCombatStats({ card: ferventBeastmaster, power: 4, life: 4, allies: [grayWolf] });
  proveAllyCombatStats({
    card: ferventBeastmaster,
    power: 3,
    life: 3,
    allies: [woodlandSquirrels],
  });
});
