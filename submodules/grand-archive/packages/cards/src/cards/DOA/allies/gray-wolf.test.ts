import { describe } from "vitest";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { grayWolf } from "./gray-wolf.ts";

/** @covers hJ2xh9lNMR-a1 */
describe("Gray Wolf \u2014 hJ2xh9lNMR-a1", () => {
  provePrideAlly({ card: grayWolf, pride: 2, power: 2 });
});
