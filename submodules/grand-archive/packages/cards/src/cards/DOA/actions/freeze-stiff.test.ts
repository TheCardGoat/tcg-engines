import { describe } from "vitest";
import { freezeStiff } from "./freeze-stiff.ts";
import { proveCombatRest } from "../../../testing/combat-rest-action.ts";
/** @covers qyRKqSkAQX-a1 */
describe("freeze-stiff's combat interruption", () => {
  proveCombatRest({ card: freezeStiff, cost: 3, freeze: true });
});
