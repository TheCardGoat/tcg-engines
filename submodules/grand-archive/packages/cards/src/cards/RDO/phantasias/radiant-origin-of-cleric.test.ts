import { describe } from "vitest";
import { radiantOriginOfCleric } from "./radiant-origin-of-cleric.ts";
import { proveRadiantOrigin } from "../../../testing/radiant-origin.ts";
/** @covers XSgcay9ZB7-a2 */
/** @covers XSgcay9ZB7-a3 */
describe("Radiant Origin of Cleric — training and paid level-up", () => {
  proveRadiantOrigin({
    card: radiantOriginOfCleric,
    abilityId: "XSgcay9ZB7-a3",
    threshold: 8,
    cost: 4,
    training: "recovery",
  });
});
