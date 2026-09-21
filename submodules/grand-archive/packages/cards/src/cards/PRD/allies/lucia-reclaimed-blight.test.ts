import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { luciaReclaimedBlight } from "./lucia-reclaimed-blight.ts";

/** @covers fIQR28QmYg-a1 */
describe("Lucia, Reclaimed Blight — printed keywords", () => {
  proveKeywordGroup({
    card: luciaReclaimedBlight,
    keywords: [
      {
        name: "elysian-aura",
      },
      {
        name: "stealth",
      },
    ],
  });
});
