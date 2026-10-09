import { describe } from "vitest";
import { radiantOriginOfMage } from "./radiant-origin-of-mage.ts";
import { proveRadiantOrigin } from "../../../testing/radiant-origin.ts";
/** @covers dOPqsWYMCQ-a2 */
/** @covers dOPqsWYMCQ-a3 */
describe("Radiant Origin of Mage — training and paid level-up", () => {
  proveRadiantOrigin({
    card: radiantOriginOfMage,
    abilityId: "dOPqsWYMCQ-a3",
    threshold: 6,
    cost: 4,
    training: "empower",
  });
});
