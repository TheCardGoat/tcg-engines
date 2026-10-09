import { describe } from "vitest";
import { rampartDefender } from "./rampart-defender.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers Znvu05tvWC-a2 */
describe("Rampart Defender Ranged", () => {
  proveRangedAlly({ card: rampartDefender, power: 2, ranged: 3, classBonus: true });
});
