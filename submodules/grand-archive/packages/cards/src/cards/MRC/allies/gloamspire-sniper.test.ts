import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { gloamspireSniper } from "./gloamspire-sniper.ts";

/** @covers 6hjlgx72rf-a1 */
describe("Gloamspire Sniper — printed keywords", () => {
  proveKeywordGroup({
    card: gloamspireSniper,
    keywords: [
      {
        name: "ranged",
        value: 4,
      },
      {
        name: "true-sight",
      },
    ],
  });
});
