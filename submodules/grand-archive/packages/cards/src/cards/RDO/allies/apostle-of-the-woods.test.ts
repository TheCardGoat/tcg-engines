import { describe } from "vitest";
import { apostleOfTheWoods } from "./apostle-of-the-woods.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers sg2ghTKuDt-a1 */
describe("Apostle of the Woods Pride", () => {
  provePrideAlly({ card: apostleOfTheWoods, power: 3, pride: 3 });
});
