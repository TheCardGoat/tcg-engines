import { describe } from "vitest";

import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { seasonedArcher } from "./seasoned-archer.ts";

/** @covers fvyhuxzjk8-a1 */
describe("Seasoned Archer — Class Bonus Ranged 3", () => {
  proveRangedAlly({ card: seasonedArcher, power: 1, ranged: 3, classBonus: true });
});
