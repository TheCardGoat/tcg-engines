import { describe } from "vitest";

import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { trainedSharpshooter } from "./trained-sharpshooter.ts";

/** @covers uhjxhkurfp-a1 */
describe("trained-sharpshooter — Ranged", () => {
  proveRangedAlly({ card: trainedSharpshooter, power: 2, ranged: 2, classBonus: true });
});
