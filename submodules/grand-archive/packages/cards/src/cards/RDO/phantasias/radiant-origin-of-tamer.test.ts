import { describe } from "vitest";
import { radiantOriginOfTamer } from "./radiant-origin-of-tamer.ts";
import { proveRadiantOrigin } from "../../../testing/radiant-origin.ts";
/** @covers zS0TJ97QSV-a2 */
/** @covers zS0TJ97QSV-a3 */
describe("Radiant Origin of Tamer — training and paid level-up", () => {
  proveRadiantOrigin({
    card: radiantOriginOfTamer,
    abilityId: "zS0TJ97QSV-a3",
    threshold: 7,
    cost: 3,
    training: "animal-attacks",
  });
});
