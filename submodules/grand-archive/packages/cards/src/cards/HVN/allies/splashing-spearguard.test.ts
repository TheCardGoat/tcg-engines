import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { splashingSpearguard } from "./splashing-spearguard.ts";

/** @covers 4a87hk0bkh-a1 */
describe("Splashing Spearguard — Imbue keyword", () => {
  proveImbueKeyword({
    card: splashingSpearguard,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});
