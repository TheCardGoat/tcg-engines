import { describe } from "vitest";
import { radiantOriginOfAssassin } from "./radiant-origin-of-assassin.ts";
import { proveRadiantOrigin } from "../../../testing/radiant-origin.ts";
/** @covers T5ZEoIRdZr-a2 */
/** @covers T5ZEoIRdZr-a3 */
describe("Radiant Origin of Assassin — training and paid level-up", () => {
  proveRadiantOrigin({
    card: radiantOriginOfAssassin,
    abilityId: "T5ZEoIRdZr-a3",
    threshold: 4,
    cost: 5,
    training: "prepared",
  });
});
