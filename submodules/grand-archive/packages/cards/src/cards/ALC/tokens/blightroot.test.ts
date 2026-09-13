import { describe } from "vitest";

import { proveSacrificeLevel } from "../../../testing/sacrifice-level.ts";
import { blightroot } from "./blightroot.ts";

/** @covers i0a5uhjxhk-a1 */
describe("blightroot — temporary champion level", () => {
  proveSacrificeLevel({ card: blightroot, abilityId: "i0a5uhjxhk-a1", amount: 1 });
});
