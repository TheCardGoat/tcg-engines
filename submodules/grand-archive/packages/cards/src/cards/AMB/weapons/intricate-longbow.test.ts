import { describe } from "vitest";

import { proveBowMustBeLoaded } from "../../../testing/bow-loaded.ts";
import { proveClassBonusLevelWeaponPower } from "../../../testing/class-bonus-level-weapon-power.ts";
import { intricateLongbow } from "./intricate-longbow.ts";

/** @covers 1a49w5gmf7-a1 */
describe("Intricate Longbow — Bow", () => {
  proveBowMustBeLoaded({ card: intricateLongbow });
});

/** @covers 1a49w5gmf7-a2 */
describe("Intricate Longbow — Class Bonus [Level 2+] power", () => {
  proveClassBonusLevelWeaponPower({ card: intricateLongbow, bonus: 1, loadBow: true });
});
