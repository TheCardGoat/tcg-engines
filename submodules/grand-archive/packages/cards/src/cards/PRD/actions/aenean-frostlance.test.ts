import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { aeneanFrostlance } from "./aenean-frostlance.ts";

/** @covers NXGaB1dYwL-a1 */
describe("Aenean Frostlance — fixed damage", () => {
  proveFixedDamageAction({
    card: aeneanFrostlance,
    cost: 3,
    damage: 2,
    targetKind: "unit",
  });
});

import { proveAeneanDamageLevels } from "../../../testing/aenean-damage-levels.ts";
/** @covers NXGaB1dYwL-a2 @covers NXGaB1dYwL-a3 */
describe("Aenean Frostlance level replacements", () =>
  proveAeneanDamageLevels(aeneanFrostlance, true));
