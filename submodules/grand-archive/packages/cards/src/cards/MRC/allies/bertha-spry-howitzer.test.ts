import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { berthaSpryHowitzer } from "./bertha-spry-howitzer.ts";

/** @covers ki6fxxgmue-a1 */
describe("Bertha, Spry Howitzer — printed keywords", () => {
  proveKeywordGroup({
    card: berthaSpryHowitzer,
    keywords: [
      {
        name: "fast-activation",
      },
      {
        name: "ranged",
        value: 2,
      },
    ],
  });
});
