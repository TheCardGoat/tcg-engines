import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { fractalOfRain } from "./fractal-of-rain.ts";

/** @covers 3zb9p4lgdl-a1 */
describe("Fractal of Rain — Imbue keyword", () => {
  proveImbueKeyword({
    card: fractalOfRain,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
