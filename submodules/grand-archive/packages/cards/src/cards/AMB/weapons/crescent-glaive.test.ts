import { describe } from "vitest";

import { proveClassBonusLevelWeaponPower } from "../../../testing/class-bonus-level-weapon-power.ts";
import { crescentGlaive } from "./crescent-glaive.ts";

/** @covers h7iz4xkbq1-a1 */
describe("Crescent Glaive — Class Bonus [Level 2+] power", () => {
  proveClassBonusLevelWeaponPower({ card: crescentGlaive, bonus: 1 });
});
