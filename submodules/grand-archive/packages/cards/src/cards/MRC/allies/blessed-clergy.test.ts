import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { blessedClergy } from "./blessed-clergy.ts";

/** @covers a3pmmloejo-a1 */
describe("Blessed Clergy — Imbue keyword", () => {
  proveImbueKeyword({
    card: blessedClergy,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
