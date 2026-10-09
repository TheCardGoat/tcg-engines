import { describe } from "vitest";
import { shardwingSearchlight } from "./shardwing-searchlight.ts";
import { memoriteShardwing } from "../../PTM/tokens/memorite-shardwing.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers 8bRp3n2IAn-a1 */
describe("shardwingSearchlight", () => {
  proveSummonAction({
    card: shardwingSearchlight,
    cost: 3,
    tokens: [{ card: memoriteShardwing, count: 1 }],
  });
});
