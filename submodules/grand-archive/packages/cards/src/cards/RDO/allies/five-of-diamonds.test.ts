import { describe } from "vitest";
import { fiveOfDiamonds } from "./five-of-diamonds.ts";
import { proveCardistry, proveCardistryDrawReentry } from "../../../testing/cardistry.ts";
/** @covers Zq4iWqdjGp-a1 */
describe("five-of-diamonds — Cardistry", () =>
  proveCardistry({
    card: fiveOfDiamonds,
    abilityId: "Zq4iWqdjGp-a1",
    sourceCost: 5,
    cost: 5,
    drawCount: 1,
    result: "draw-memory",
  }));

/** @covers Zq4iWqdjGp-a1 */
describe("five-of-diamonds — instance tracking", () =>
  proveCardistryDrawReentry(fiveOfDiamonds, "Zq4iWqdjGp-a1", 5, 1, true));
