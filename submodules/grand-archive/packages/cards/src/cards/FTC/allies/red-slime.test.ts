import { describe } from "vitest";
import { redSlime } from "./red-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers mttsvbgl6f-a1 */
describe("Red Slime Pride", () => {
  provePrideAlly({ card: redSlime, power: 3, pride: 3 });
});
