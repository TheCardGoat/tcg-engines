import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { reverentSeraphim } from "./reverent-seraphim.ts";

/** @covers e5r6eVzpkD-a1 */
describe("Reverent Seraphim — Imbue keyword", () => {
  proveImbueKeyword({
    card: reverentSeraphim,
    cost: { kind: "reserve", amount: 3 },
    threshold: 2,
    requirement: "advanced",
  });
});
