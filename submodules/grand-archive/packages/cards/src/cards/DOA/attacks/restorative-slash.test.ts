import { proveOnAttackRecover } from "../../../testing/on-attack-recover.ts";
import { describe } from "vitest";
import { restorativeSlash } from "./restorative-slash.ts";

/** @covers e8nFGSSvgc-a1 */
describe("Restorative Slash \u2014 resolution", () => {
  proveOnAttackRecover({
    card: restorativeSlash,
    abilityId: "e8nFGSSvgc-a1",
    amount: 3,
    attackCost: 4,
  });
});
