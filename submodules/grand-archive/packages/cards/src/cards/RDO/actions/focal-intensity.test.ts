import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { focalIntensity } from "./focal-intensity.ts";

/** @covers IM2SpTAKfp-a1 */
describe("Focal Intensity — fixed damage", () => {
  proveFixedDamageAction({
    card: focalIntensity,
    cost: 1,
    damage: 1,
    targetKind: "unit",
  });
});
