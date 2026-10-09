import { describe } from "vitest";
import { vigilRempart } from "./vigil-rempart.ts";
import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";

/** @covers pc3zpkw43o-a1 */
describe("Vigil Rempart Class Bonus", () => {
  for (const classBonus of [false, true])
    proveAllyCombatStats({
      card: vigilRempart,
      classBonus,
      power: 1 + (classBonus ? 2 : 0),
      life: 4,
    });
});
