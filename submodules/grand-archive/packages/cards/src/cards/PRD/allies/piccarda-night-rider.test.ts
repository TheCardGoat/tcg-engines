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
