import { describe } from "vitest";
import { spiritOfSereneFire } from "./spirit-of-serene-fire.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers da2ha4dk88-a1 */
describe("spiritOfSereneFire — starting glimpse and draw", () => {
  proveStartingGlimpse({ card: spiritOfSereneFire, count: 6, draw: 6, memory: false });
});

import { proveSereneLineageRelease } from "../../../testing/serene-lineage-release.ts";
import { blitzMage } from "../../DOA/allies/blitz-mage.ts";
/** @covers da2ha4dk88-a2 */
describe("spiritOfSereneFire Lineage Release", () =>
  proveSereneLineageRelease(spiritOfSereneFire, blitzMage));
