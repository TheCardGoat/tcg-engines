import { describe } from "vitest";
import { longtailGrovesward } from "./longtail-grovesward.ts";
import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";

/** @covers jn4mwv930y-a2 */
describe("Longtail Grovesward — level-gated life", () => {
  for (const level of [0, 1, 2]) {
    proveAllyCombatStats({ card: longtailGrovesward, power: 2, life: level >= 1 ? 3 : 2, level });
  }
});
