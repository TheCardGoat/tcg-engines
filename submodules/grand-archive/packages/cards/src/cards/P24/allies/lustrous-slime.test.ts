import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { lustrousSlime } from "./lustrous-slime.ts";

/** @covers ejvddohjdu-a1 */
describe("Lustrous Slime — printed keywords", () => {
  proveKeywordGroup({
    card: lustrousSlime,
    keywords: [
      {
        name: "pride",
        value: 5,
      },
      {
        name: "taunt",
      },
    ],
  });
});
