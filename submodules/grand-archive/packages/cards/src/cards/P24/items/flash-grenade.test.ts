import { describe } from "vitest";
import { flashGrenade } from "./flash-grenade.ts";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
/** @covers isxy5lh23q-a1 */
describe("flashGrenade — Class Bonus entry draw", () => {
  proveOnEnterDraw({
    card: flashGrenade,
    abilityId: "isxy5lh23q-a1",
    cost: { kind: "memory", amount: 1 },
    destination: "hand",
    classBonus: true,
  });
});
