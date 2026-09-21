import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { nimbleCourtAssassin } from "./nimble-court-assassin.ts";

/** @covers i2vPUpbPEl-a1 */
describe("Nimble Court Assassin — printed keywords", () => {
  proveKeywordGroup({
    card: nimbleCourtAssassin,
    keywords: [
      {
        name: "ambush",
      },
      {
        name: "vigor",
      },
    ],
  });
});
