import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { andronikaEternalHerald } from "./andronika-eternal-herald.ts";

/** @covers vw2ifz1nr5-a1 */
describe("Andronika, Eternal Herald — Imbue keyword", () => {
  proveImbueKeyword({
    card: andronikaEternalHerald,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});
