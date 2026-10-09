import { describe } from "vitest";
import { babyBlueSlime } from "./baby-blue-slime.ts";
import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";

/** @covers 9ggfiy38t2-a1 */
describe("Baby Blue Slime Class Bonus", () => {
  for (const classBonus of [false, true])
    proveAllyCombatStats({
      card: babyBlueSlime,
      classBonus,
      power: 1,
      life: 2 + Number(classBonus),
    });
});
