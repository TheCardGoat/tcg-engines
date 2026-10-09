import { describe } from "vitest";
import { spiritOfSereneWind } from "./spirit-of-serene-wind.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers h973fdt8pt-a1 */
describe("spiritOfSereneWind — starting glimpse and draw", () => {
  proveStartingGlimpse({ card: spiritOfSereneWind, count: 6, draw: 6, memory: false });
});

import { proveSereneLineageRelease } from "../../../testing/serene-lineage-release.ts";
import { windriderMage } from "../../DOA/allies/windrider-mage.ts";
/** @covers h973fdt8pt-a2 */
describe("spiritOfSereneWind Lineage Release", () =>
  proveSereneLineageRelease(spiritOfSereneWind, windriderMage));
