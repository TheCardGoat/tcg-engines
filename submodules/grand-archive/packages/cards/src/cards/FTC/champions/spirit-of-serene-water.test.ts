import { describe } from "vitest";
import { spiritOfSereneWater } from "./spirit-of-serene-water.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers zq9ox7u6wz-a1 */
describe("spiritOfSereneWater — starting glimpse and draw", () => {
  proveStartingGlimpse({ card: spiritOfSereneWater, count: 6, draw: 6, memory: false });
});

import { proveSereneLineageRelease } from "../../../testing/serene-lineage-release.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
/** @covers zq9ox7u6wz-a2 */
describe("spiritOfSereneWater Lineage Release", () =>
  proveSereneLineageRelease(spiritOfSereneWater, giantTortoise));
