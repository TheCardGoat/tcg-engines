import { describe } from "vitest";

import { proveSacrificeLevel } from "../../../testing/sacrifice-level.ts";
import { manaroot } from "./manaroot.ts";

/** @covers 5joh300z2s-a1 */
describe("manaroot — temporary champion level", () => {
  proveSacrificeLevel({ card: manaroot, abilityId: "5joh300z2s-a1", amount: 1 });
});
