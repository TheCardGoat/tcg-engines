import { describe } from "vitest";
import { twoOfSpades } from "./two-of-spades.ts";
import { proveCardistry } from "../../../testing/cardistry.ts";
/** @covers e8ygl32jef-a2 */
describe("two-of-spades — Cardistry", () => {
  proveCardistry({
    card: twoOfSpades,
    abilityId: "e8ygl32jef-a2",
    sourceCost: 2,
    cost: 2,
    result: "buff-self",
  });
});
