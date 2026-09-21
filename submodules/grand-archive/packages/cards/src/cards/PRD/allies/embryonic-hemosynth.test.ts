import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { embryonicHemosynth } from "./embryonic-hemosynth.ts";

/** @covers JQQXhhIla9-a1 */
describe("Embryonic Hemosynth — printed keywords", () => {
  proveKeywordGroup({
    card: embryonicHemosynth,
    keywords: [
      {
        name: "elysian-aura",
      },
      {
        name: "spellshroud",
      },
      {
        name: "taunt",
      },
    ],
  });
});
