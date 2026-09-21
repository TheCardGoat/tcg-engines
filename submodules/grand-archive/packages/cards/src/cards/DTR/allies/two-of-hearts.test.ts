import { describe } from "vitest";
import { twoOfHearts } from "./two-of-hearts.ts";
import { proveCardistryPower } from "../../../testing/cardistry-power.ts";
/** @covers rufki4o41y-a1 */
describe("Two of Hearts — Cardistry power", () => {
  proveCardistryPower({ card: twoOfHearts, abilityId: "rufki4o41y-a1", cost: 2, bonus: 2 });
});
