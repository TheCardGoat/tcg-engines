import { describe } from "vitest";
import { fourOfSpades } from "./four-of-spades.ts";
import { proveCardistry } from "../../../testing/cardistry.ts";
/** @covers 8bolq2y5qp-a1 */
describe("four-of-spades — Cardistry", () => {
  proveCardistry({
    card: fourOfSpades,
    abilityId: "8bolq2y5qp-a1",
    sourceCost: 4,
    cost: 4,
    result: "draw-memory",
  });
});
