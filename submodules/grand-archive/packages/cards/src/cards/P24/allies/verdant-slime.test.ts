import { describe } from "vitest";
import { verdantSlime } from "./verdant-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers kkbbu08s5r-a1 */
describe("Verdant Slime Pride", () => {
  provePrideAlly({ card: verdantSlime, power: 2, pride: 5 });
});

import { proveClassTaunt } from "../../../testing/class-taunt.ts";
/** @covers kkbbu08s5r-a2 */
describe("verdantSlime — class Taunt", () => {
  proveClassTaunt(verdantSlime);
});
