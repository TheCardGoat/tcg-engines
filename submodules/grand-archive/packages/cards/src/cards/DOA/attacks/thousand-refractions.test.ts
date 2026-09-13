import { provePreparedAttack } from "../../../testing/prepared-attack.ts";
import { describe } from "vitest";
import { thousandRefractions } from "./thousand-refractions.ts";

/** @covers XLbCBxla8K-a1 @covers XLbCBxla8K-a2 */
describe("Thousand Refractions \u2014 resolution", () => {
  provePreparedAttack({
    card: thousandRefractions,
    cost: 0,
    power: 1,
    wake: true,
    returnToHand: true,
  });
});
