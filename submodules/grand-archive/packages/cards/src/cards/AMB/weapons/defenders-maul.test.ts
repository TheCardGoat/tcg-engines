import { describe } from "vitest";

import { proveClassBonusLevelWeaponPower } from "../../../testing/class-bonus-level-weapon-power.ts";
import { defendersMaul } from "./defenders-maul.ts";

/** @covers chnppup4iz-a1 @covers chnppup4iz-a2 */
describe("Defender's Maul — Class Bonus [Level 2+] power and attack tax", () => {
  proveClassBonusLevelWeaponPower({ card: defendersMaul, bonus: 2, attackReserveCost: 2 });
});
