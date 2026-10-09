import { describe } from "vitest";
import { engineeredSlime } from "./engineered-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers kkz07nau5s-a1 */
describe("Engineered Slime Pride", () => {
  provePrideAlly({ card: engineeredSlime, power: 2, pride: 2 });
});
