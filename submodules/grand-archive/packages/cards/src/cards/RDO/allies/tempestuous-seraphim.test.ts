import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { tempestuousSeraphim } from "./tempestuous-seraphim.ts";

/** @covers HYFtrEXYFi-a2 */
describe("Tempestuous Seraphim — Imbue keyword", () => {
  proveImbueKeyword({
    card: tempestuousSeraphim,
    cost: { kind: "reserve", amount: 3 },
    threshold: 2,
    requirement: "advanced",
  });
});
