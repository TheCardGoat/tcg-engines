import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { kraalStonescaleTyrant } from "./kraal-stonescale-tyrant.ts";

/** @covers 572j3oda2h-a2 */
describe("Kraal, Stonescale Tyrant — printed keywords", () => {
  proveKeywordGroup({
    card: kraalStonescaleTyrant,
    directField: true,
    keywords: [
      {
        name: "intercept",
      },
      {
        name: "spellshroud",
      },
      {
        name: "true-sight",
      },
      {
        name: "vigor",
      },
    ],
  });
});
