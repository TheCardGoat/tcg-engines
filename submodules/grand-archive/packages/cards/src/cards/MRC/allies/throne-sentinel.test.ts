import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { throneSentinel } from "./throne-sentinel.ts";

/** @covers RP37sLrsxr-a1 */
describe("Throne Sentinel — printed keywords", () => {
  proveKeywordGroup({
    card: throneSentinel,
    keywords: [
      {
        name: "hindered",
      },
      {
        name: "taunt",
      },
    ],
  });
});
