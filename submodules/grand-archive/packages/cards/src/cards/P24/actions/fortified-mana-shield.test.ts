import { describe } from "vitest";
import { fortifiedManaShield } from "./fortified-mana-shield.ts";

import { proveTargetNextPrevention } from "../../../testing/target-next-prevention.ts";
/** @covers 5lh23qu7d6-a2 */
describe("fortified-mana-shield — next damage", () => {
  proveTargetNextPrevention({ card: fortifiedManaShield, cost: 2, capacity: 4, noncombat: true });
});
