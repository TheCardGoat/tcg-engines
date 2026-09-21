import { describe } from "vitest";
import { wonderlandsReign } from "./wonderlands-reign.ts";
import { proveCardistry } from "../../../testing/cardistry.ts";
/** @covers 0mf1ug6yfi-a1 */
describe("wonderlands-reign — Cardistry", () => {
  proveCardistry({
    card: wonderlandsReign,
    abilityId: "0mf1ug6yfi-a1",
    sourceCost: 0,
    cost: 10,
    result: "draw-hand",
  });
});
