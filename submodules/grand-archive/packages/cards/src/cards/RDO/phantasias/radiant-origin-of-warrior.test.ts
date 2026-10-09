import { describe } from "vitest";
import { radiantOriginOfWarrior } from "./radiant-origin-of-warrior.ts";
import { proveRadiantOrigin } from "../../../testing/radiant-origin.ts";
/** @covers lqILsIDHNc-a2 */
/** @covers lqILsIDHNc-a3 */
describe("Radiant Origin of Warrior — training and paid level-up", () => {
  proveRadiantOrigin({
    card: radiantOriginOfWarrior,
    abilityId: "lqILsIDHNc-a3",
    threshold: 4,
    cost: 3,
    training: "weapon-attacks",
  });
});
