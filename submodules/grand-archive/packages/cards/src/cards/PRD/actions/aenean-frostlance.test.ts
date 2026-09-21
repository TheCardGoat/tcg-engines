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
