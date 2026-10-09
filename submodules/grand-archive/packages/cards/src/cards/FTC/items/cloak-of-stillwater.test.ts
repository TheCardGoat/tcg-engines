import { describe } from "vitest";
import { cloakOfStillwater } from "./cloak-of-stillwater.ts";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
/** @covers 2ha4dk88zq-a1 */
describe("cloakOfStillwater — Class Bonus entry draw", () => {
  proveOnEnterDraw({
    card: cloakOfStillwater,
    abilityId: "2ha4dk88zq-a1",
    cost: { kind: "memory", amount: 1 },
    destination: "hand",
    classBonus: true,
  });
});
