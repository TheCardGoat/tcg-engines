import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { cultivate } from "./cultivate.ts";

/** @covers cy3gme0xxw-a1 */
describe("Cultivate — Imbue keyword", () => {
  proveImbueKeyword({
    card: cultivate,
    cost: { kind: "reserve", amount: 2 },
    threshold: 1,
    requirement: "source-elements",
  });
});
