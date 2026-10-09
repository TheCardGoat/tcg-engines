import { describe } from "vitest";
import { twilightSlime } from "./twilight-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers 62u1231c0z-a1 */
describe("Twilight Slime Pride", () => {
  provePrideAlly({ card: twilightSlime, power: 1, pride: 3 });
});
