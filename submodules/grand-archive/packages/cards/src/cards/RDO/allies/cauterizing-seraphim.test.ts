import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { cauterizingSeraphim } from "./cauterizing-seraphim.ts";

/** @covers TYlWgIYsq3-a1 */
describe("Cauterizing Seraphim — Imbue keyword", () => {
  proveImbueKeyword({
    card: cauterizingSeraphim,
    cost: { kind: "reserve", amount: 4 },
    threshold: 0,
    requirement: "advanced",
    declaredX: 1,
  });
});
