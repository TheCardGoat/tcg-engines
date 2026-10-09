import { describe } from "vitest";
import { radiantOriginOfGuardian } from "./radiant-origin-of-guardian.ts";
import { proveRadiantOrigin } from "../../../testing/radiant-origin.ts";
/** @covers yT32RI6pqt-a2 */
/** @covers yT32RI6pqt-a3 */
describe("Radiant Origin of Guardian — training and paid level-up", () => {
  proveRadiantOrigin({
    card: radiantOriginOfGuardian,
    abilityId: "yT32RI6pqt-a3",
    threshold: 5,
    cost: 3,
    training: "unit-damage",
  });
});
