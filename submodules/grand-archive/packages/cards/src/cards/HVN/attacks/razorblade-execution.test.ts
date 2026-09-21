import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { razorbladeExecution } from "./razorblade-execution.ts";

/** @covers myvztzk3v8-a1 */
describe("Razorblade Execution — Imbue keyword", () => {
  proveImbueKeyword({
    card: razorbladeExecution,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});
