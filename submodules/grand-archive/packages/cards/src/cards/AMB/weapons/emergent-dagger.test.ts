import { describe } from "vitest";

import { proveClassBonusLevelWeaponPower } from "../../../testing/class-bonus-level-weapon-power.ts";
import { emergentDagger } from "./emergent-dagger.ts";

/** @covers wljhyokktb-a1 */
describe("Emergent Dagger — Class Bonus [Level 2+] power", () => {
  proveClassBonusLevelWeaponPower({ card: emergentDagger, bonus: 2 });
});
