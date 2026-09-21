import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { suffocatingMiasma } from "./suffocating-miasma.ts";

/** @covers coxpnjvt9y-a1 */
describe("Suffocating Miasma — Imbue keyword", () => {
  proveImbueKeyword({
    card: suffocatingMiasma,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
