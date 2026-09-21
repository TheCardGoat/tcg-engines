import { describe } from "vitest";
import { fiveOfHearts } from "./five-of-hearts.ts";
import { proveCardistry } from "../../../testing/cardistry.ts";
/** @covers idq4ih00rq-a2 */
describe("five-of-hearts — Cardistry", () => {
  proveCardistry({
    card: fiveOfHearts,
    abilityId: "idq4ih00rq-a2",
    sourceCost: 5,
    cost: 5,
    result: "buff-team",
  });
});
