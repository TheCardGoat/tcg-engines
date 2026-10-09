import { describe } from "vitest";
import { signalGunner } from "./signal-gunner.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers fsudPn5GQH-a1 */
describe("Signal Gunner Ranged", () => {
  proveRangedAlly({ card: signalGunner, power: 1, ranged: 2, classBonus: false });
});
