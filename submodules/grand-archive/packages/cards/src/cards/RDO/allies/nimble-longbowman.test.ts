import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { nimbleLongbowman } from "./nimble-longbowman.ts";

/** @covers tMy4zMpqcH-a1 */
describe("Nimble Longbowman — printed keywords", () => {
  proveKeywordGroup({
    card: nimbleLongbowman,
    keywords: [
      {
        name: "fast-activation",
      },
      {
        name: "ranged",
        value: 1,
      },
    ],
  });
});
