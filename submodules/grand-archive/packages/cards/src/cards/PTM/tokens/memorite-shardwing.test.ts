import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { memoriteShardwing } from "./memorite-shardwing.ts";

/** @covers LxF5riNjnL-a1 */
describe("Memorite Shardwing — printed keywords", () => {
  proveKeywordGroup({
    card: memoriteShardwing,
    directField: true,
    keywords: [
      {
        name: "stealth",
      },
      {
        name: "true-sight",
      },
    ],
  });
});
