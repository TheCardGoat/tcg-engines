import { describe } from "vitest";
import { radiantOriginOfRanger } from "./radiant-origin-of-ranger.ts";
import { proveRadiantOrigin } from "../../../testing/radiant-origin.ts";
/** @covers tp7eVOsAHU-a2 */
/** @covers tp7eVOsAHU-a3 */
describe("Radiant Origin of Ranger — training and paid level-up", () => {
  proveRadiantOrigin({
    card: radiantOriginOfRanger,
    abilityId: "tp7eVOsAHU-a3",
    threshold: 6,
    cost: 3,
    training: "distant",
  });
});
