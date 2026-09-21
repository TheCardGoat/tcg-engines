import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { cheshireCatImpishGrin } from "./cheshire-cat-impish-grin.ts";

/** @covers cUltOcPo26-a1 */
describe("Cheshire Cat, Impish Grin — printed keywords", () => {
  proveKeywordGroup({
    card: cheshireCatImpishGrin,
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
