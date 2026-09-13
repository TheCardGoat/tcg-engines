import { describe } from "vitest";
import { glacialGuidance } from "./glacial-guidance.ts";
import { proveCombatRest } from "../../../testing/combat-rest-action.ts";
/** @covers 6IOxuftyVv-a1 @covers 6IOxuftyVv-a2 */
describe("glacial-guidance's combat interruption", () => {
  proveCombatRest({ card: glacialGuidance, cost: 1, freeze: false });
});
