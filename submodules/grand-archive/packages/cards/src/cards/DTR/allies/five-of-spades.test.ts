import { describe } from "vitest";
import { fiveOfSpades } from "./five-of-spades.ts";
import { proveCardistryPower } from "../../../testing/cardistry-power.ts";
/** @covers i9hf5lhl5f-a1 */
describe("Five of Spades — Cardistry power", () => {
  proveCardistryPower({ card: fiveOfSpades, abilityId: "i9hf5lhl5f-a1", cost: 5, bonus: 5 });
});
