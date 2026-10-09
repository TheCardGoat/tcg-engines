import { describe } from "vitest";
import { outriderOfWaves } from "./outrider-of-waves.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers rltyxefm80-a1 */
describe("Outrider of Waves Ranged", () => {
  proveRangedAlly({ card: outriderOfWaves, power: 1, ranged: 2, classBonus: false });
});
