import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { piccardaNightRider } from "./piccarda-night-rider.ts";

/** @covers ooGvrzxTmr-a2 */
describe("Piccarda, Night Rider — printed keywords", () => {
  proveKeywordGroup({
    card: piccardaNightRider,
    classBonus: true,
    keywords: [
      {
        name: "spellshroud",
      },
      {
        name: "stealth",
      },
    ],
  });
});

import { proveDefenderDependentPower } from "../../../testing/defender-dependent-power.ts";
/** @covers ooGvrzxTmr-a3 */
describe("piccardaNightRider defender-dependent power", () => {
  proveDefenderDependentPower(piccardaNightRider, "champion", 4);
});
