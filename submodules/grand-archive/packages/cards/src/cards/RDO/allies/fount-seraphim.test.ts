import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { fountSeraphim } from "./fount-seraphim.ts";

/** @covers k4pjo6lVMO-a1 */
describe("Fount Seraphim — Imbue keyword", () => {
  proveImbueKeyword({
    card: fountSeraphim,
    cost: { kind: "reserve", amount: 3 },
    threshold: 2,
    requirement: "advanced",
  });
});
