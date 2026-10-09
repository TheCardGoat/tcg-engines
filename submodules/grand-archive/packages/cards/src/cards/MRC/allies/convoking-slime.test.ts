import { describe } from "vitest";
import { convokingSlime } from "./convoking-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers b1w1mvu68a-a1 */
describe("Convoking Slime Pride", () => {
  provePrideAlly({ card: convokingSlime, power: 2, pride: 3 });
});

import { proveClassPhaseSummon } from "../../../testing/class-phase-summon.ts";
/** @covers b1w1mvu68a-a2 */
describe("convokingSlime phase summon", () =>
  proveClassPhaseSummon(convokingSlime, convokingSlime, "recollection", true));
