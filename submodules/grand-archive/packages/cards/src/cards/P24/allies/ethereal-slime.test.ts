import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { etherealSlime } from "./ethereal-slime.ts";

/** @covers n06zlhihka-a1 */
describe("Ethereal Slime — printed keywords", () => {
  proveKeywordGroup({
    card: etherealSlime,
    keywords: [
      {
        name: "pride",
        value: 3,
      },
      {
        name: "stealth",
      },
      {
        name: "true-sight",
      },
    ],
  });
});
