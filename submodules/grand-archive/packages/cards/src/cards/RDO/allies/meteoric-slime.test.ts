import { describe } from "vitest";
import { meteoricSlime } from "./meteoric-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers 5ybMub985n-a1 */
describe("Meteoric Slime Pride", () => {
  provePrideAlly({ card: meteoricSlime, power: 1, pride: 3 });
});
