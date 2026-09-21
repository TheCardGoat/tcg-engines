import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { senarisSixOfDiamonds } from "./senaris-six-of-diamonds.ts";

/** @covers EIpkYYSP3s-a1 */
describe("Senaris, Six of Diamonds — printed keywords", () => {
  proveKeywordGroup({
    card: senarisSixOfDiamonds,
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
