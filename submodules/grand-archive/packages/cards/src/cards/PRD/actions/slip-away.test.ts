import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { slipAway } from "./slip-away.ts";

/** @covers ooffy4dwav-a1 */
describe("Slip Away — Imbue keyword", () => {
  proveImbueKeyword({
    card: slipAway,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
