import { describe } from "vitest";
import { torchMarshal } from "./torch-marshal.ts";
import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";

/** @covers izgiu216l2-a1 */
describe("Torch Marshal Class Bonus", () => {
  for (const classBonus of [false, true])
    proveAllyCombatStats({
      card: torchMarshal,
      classBonus,
      power: 3 + Number(classBonus),
      life: 3,
      attackReserveCost: 2,
    });
});
