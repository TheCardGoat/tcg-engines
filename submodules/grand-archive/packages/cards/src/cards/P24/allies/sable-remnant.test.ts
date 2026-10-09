import { describe } from "vitest";
import { sableRemnant } from "./sable-remnant.ts";
import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";

/** @covers 8n4zw4gq5w-a1 */
describe("Sable Remnant Class Bonus", () => {
  for (const classBonus of [false, true])
    proveAllyCombatStats({
      card: sableRemnant,
      classBonus,
      power: 1 + Number(classBonus),
      life: 1,
    });
});
