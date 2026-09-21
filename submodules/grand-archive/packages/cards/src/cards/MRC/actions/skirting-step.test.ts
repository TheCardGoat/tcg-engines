import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { skirtingStep } from "./skirting-step.ts";

/** @covers brq9x9z2k2-a1 */
describe("Skirting Step — Imbue keyword", () => {
  proveImbueKeyword({
    card: skirtingStep,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
