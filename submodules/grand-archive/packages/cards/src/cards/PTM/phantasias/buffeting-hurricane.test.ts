import { describe } from "vitest";
import { buffetingHurricane } from "./buffeting-hurricane.ts";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
/** @covers CjL1WPvWHw-a2 */
describe("buffetingHurricane — Class Bonus entry draw", () => {
  proveOnEnterDraw({
    card: buffetingHurricane,
    abilityId: "CjL1WPvWHw-a2",
    cost: { kind: "reserve", amount: 3 },
    destination: "memory",
    classBonus: true,
  });
});
